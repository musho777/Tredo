package com.tredo.sms

import android.content.Context
import android.app.Activity
import android.content.Intent
import android.os.Build
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.provider.Telephony


class SmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "SmsModule"
    }

    @ReactMethod
    fun sendSms(phoneNumber: String, message: String) {
        val activity: Activity? = currentActivity
        activity?.runOnUiThread {
            try {
                val intent = Intent(Intent.ACTION_SENDTO).apply {
                    data = Uri.parse("smsto:$phoneNumber")
                    putExtra("sms_body", message)
                }
                activity.startActivity(intent)
            } catch (e: Exception) {
                Log.e("SmsModule", "Error sending SMS", e)
            }
        }
    }
    @ReactMethod
    fun setAsDefaultSmsApp() {
        val context: Context = reactApplicationContext.applicationContext

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            val intent = Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT)
            intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, context.packageName)
            context.startActivity(intent)
        } else {
            // Handle devices below KitKat (API 19) if necessary
            // For example, display an error message
            throw UnsupportedOperationException("Cannot set as default SMS app below KitKat (API 19)")
        }
    }
}
