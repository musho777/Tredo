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

        // Define the selection (filter) to get SMS from the last 20 minutes
        val selection = "${Telephony.Sms.DATE} > ?"
        val selectionArgs = arrayOf(twentyMinutesAgo.toString())

        // Query for SMS
        val cursor: Cursor? = contentResolver.query(
            Telephony.Sms.CONTENT_URI,
            arrayOf(Telephony.Sms.ADDRESS, Telephony.Sms.BODY, Telephony.Sms.DATE),
            selection, // Use the filter to get SMS from the last 20 minutes
            selectionArgs, // Pass the timestamp for 20 minutes ago
            Telephony.Sms.DEFAULT_SORT_ORDER
        )

        cursor?.let {
            while (it.moveToNext()) {
                val messageBody = it.getString(it.getColumnIndex(Telephony.Sms.BODY))
                val senderPhoneNumber = it.getString(it.getColumnIndex(Telephony.Sms.ADDRESS))
                val timestamp = it.getLong(it.getColumnIndex(Telephony.Sms.DATE))

                val smsMap: WritableMap = Arguments.createMap()
                smsMap.putString("body", messageBody)
                smsMap.putString("originatingAddress", senderPhoneNumber)
                smsMap.putDouble("timestamp", timestamp.toDouble())

                smsList.pushMap(smsMap)
            }
            it.close()
        }

        promise.resolve(smsList)
    } catch (e: Exception) {
        promise.reject("ERROR", e)
    }
}


}
