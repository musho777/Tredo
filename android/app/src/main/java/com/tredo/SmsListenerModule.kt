package com.tredo

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.telephony.SmsMessage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

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
}
