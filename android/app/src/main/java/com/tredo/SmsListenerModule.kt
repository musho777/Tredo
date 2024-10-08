package com.tredo

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.telephony.SmsMessage
import android.provider.Telephony
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Promise
import android.database.Cursor
import com.facebook.react.bridge.WritableArray
import android.app.Notification
import android.app.NotificationManager
import android.os.SystemClock
import android.telephony.TelephonyManager
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat

class SmsListenerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val reactContext: ReactApplicationContext = reactContext
    private var smsReceiver: BroadcastReceiver? = null

    init {
        registerSMSReceiver()
    }

    override fun getName(): String {
        return "SmsListenerModule"
    }

    private fun sendEvent(eventName: String, message: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, message)
    }

    private fun registerSMSReceiver() {
        if (smsReceiver == null) {
            smsReceiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context?, intent: Intent?) {
                    val extras = intent?.extras
                    if (extras != null) {
                        val pdus = extras["pdus"] as Array<Any>
                        var fullMessage = ""
                        var senderPhoneNumber: String? = null
                        var timestamp: Long? = null

                        for (pdu in pdus) {
                            val sms = SmsMessage.createFromPdu(pdu as ByteArray)
                            fullMessage += sms.messageBody
                            if (senderPhoneNumber == null) {
                                senderPhoneNumber = sms.originatingAddress
                            }
                            if (timestamp == null) {
                                timestamp = sms.timestampMillis
                            }
                        }

                        val params: WritableMap = Arguments.createMap()
                        params.putString("messageBody", fullMessage)
                        params.putString("senderPhoneNumber", senderPhoneNumber)
                        params.putDouble("timestamp", timestamp?.toDouble() ?: 0.0)

                        val jsonString = params.toString()

                        sendEvent("onSMSReceived", jsonString)
                        }
                }
            }

            val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
            reactContext.registerReceiver(smsReceiver, filter)
        }
    }

    @ReactMethod
    fun startListeningToSMS() {
        registerSMSReceiver()
    }
  
@ReactMethod
fun getAllSMS(promise: Promise) {
    try {
        val smsList: WritableArray = Arguments.createArray()
        val contentResolver = reactContext.contentResolver

        // Get the current timestamp and calculate 20 minutes ago
        val currentTime = System.currentTimeMillis()
        val twentyMinutesAgo = currentTime - (20 * 60 * 1000) // 20 minutes in milliseconds

        // Define the selection (filter) to get SMS from the last 20 minutes, but now include both sent and received messages
        val selection = "(${Telephony.Sms.DATE} > ?)"
        val selectionArgs = arrayOf(twentyMinutesAgo.toString())

        // Query for SMS
        val cursor: Cursor? = contentResolver.query(
            Telephony.Sms.CONTENT_URI,
            arrayOf(Telephony.Sms.ADDRESS, Telephony.Sms.BODY, Telephony.Sms.DATE, Telephony.Sms.TYPE),
            selection, // Use the filter to get SMS from the last 20 minutes
            selectionArgs, // Pass the timestamp for 20 minutes ago
            Telephony.Sms.DEFAULT_SORT_ORDER
        )

        cursor?.let {
            while (it.moveToNext()) {
                val messageBody = it.getString(it.getColumnIndex(Telephony.Sms.BODY))
                val senderPhoneNumber = it.getString(it.getColumnIndex(Telephony.Sms.ADDRESS))
                val timestamp = it.getLong(it.getColumnIndex(Telephony.Sms.DATE))
                val smsType = it.getInt(it.getColumnIndex(Telephony.Sms.TYPE))

                val smsMap: WritableMap = Arguments.createMap()
                smsMap.putString("body", messageBody)
                smsMap.putString("originatingAddress", senderPhoneNumber)
                smsMap.putDouble("timestamp", timestamp.toDouble())

                // Optional: You can add more data based on the message type (sent or received)
                if (smsType == Telephony.Sms.MESSAGE_TYPE_SENT) {
                    smsMap.putString("type", "sent")
                } else if (smsType == Telephony.Sms.MESSAGE_TYPE_INBOX) {
                    smsMap.putString("type", "received")
                }

                smsList.pushMap(smsMap)
            }
            it.close()
        }

        promise.resolve(smsList)
    } catch (e: Exception) {
        promise.reject("ERROR", e)
    }
}


@ReactMethod
fun getLast(promise: Promise) {
    try {
        val contentResolver = reactContext.contentResolver

        // Query for the most recent SMS (limit to 1 result)
        val cursor: Cursor? = contentResolver.query(
            Telephony.Sms.CONTENT_URI,
            arrayOf(Telephony.Sms.ADDRESS, Telephony.Sms.BODY, Telephony.Sms.DATE),
            null, // No selection, we want the last SMS only
            null, // No selection arguments
            Telephony.Sms.DEFAULT_SORT_ORDER + " LIMIT 1" // Sort by default order and limit to 1
        )

        cursor?.let {
            if (it.moveToNext()) {  // Only retrieve the latest message
                val messageBody = it.getString(it.getColumnIndex(Telephony.Sms.BODY))
                val senderPhoneNumber = it.getString(it.getColumnIndex(Telephony.Sms.ADDRESS))
                val timestamp = it.getLong(it.getColumnIndex(Telephony.Sms.DATE))

                // Create a single WritableMap object for the last SMS
                val smsMap: WritableMap = Arguments.createMap()
                smsMap.putString("body", messageBody)
                smsMap.putString("originatingAddress", senderPhoneNumber)
                smsMap.putDouble("timestamp", timestamp.toDouble())

                promise.resolve(smsMap) // Resolve with the single object
            } else {
                promise.reject("NO_SMS_FOUND", "No SMS messages found")
            }
            it.close()
        } ?: run {
            promise.reject("CURSOR_ERROR", "Failed to retrieve SMS")
        }
    } catch (e: Exception) {
        promise.reject("ERROR", e)
    }
}


  @ReactMethod
    fun getRecentNotifications(promise: Promise) {
        try {
            val notificationManager = reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val activeNotifications = notificationManager.activeNotifications
            val notificationList: WritableArray = Arguments.createArray()

            // Get the current time and the cutoff time (20 minutes ago)
            val currentTime = SystemClock.elapsedRealtime()
            val twentyMinutesAgo = currentTime - (20 * 60 * 1000)  // 20 minutes ago in milliseconds

            for (notification in activeNotifications) {
                // Retrieve the timestamp of when the notification was posted
                val postTime = notification.postTime

                // Check if the notification was posted in the last 20 minutes
                if (postTime >= twentyMinutesAgo) {
                    val notificationMap: WritableMap = Arguments.createMap()
                    notificationMap.putString("packageName", notification.packageName)
                    notificationMap.putInt("id", notification.id)
                    notificationMap.putString("title", notification.notification.extras.getString(Notification.EXTRA_TITLE))
                    notificationMap.putString("text", notification.notification.extras.getString(Notification.EXTRA_TEXT))
                    notificationMap.putDouble("postTime", postTime.toDouble())

                    notificationList.pushMap(notificationMap)
                }
            }

            promise.resolve(notificationList)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

@ReactMethod
fun getPhoneNumber(promise: Promise) {
    try {
        // Check for the READ_PHONE_STATE permission
        if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "Permission to access phone state is denied")
            return
        }

        // Get TelephonyManager to retrieve phone details
        val telephonyManager = reactContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        val phoneNumber = telephonyManager.line1Number

        // Check if the phone number is available
        if (phoneNumber != null && phoneNumber.isNotEmpty()) {
            promise.resolve(phoneNumber)
        } else {
            promise.reject("NO_PHONE_NUMBER", "Phone number is not available")
        }
    } catch (e: Exception) {
        promise.reject("ERROR", e)
    }
}
}
