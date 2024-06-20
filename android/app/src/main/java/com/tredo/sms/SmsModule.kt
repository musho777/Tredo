package com.tredo.sms

import android.app.Activity
import android.content.Intent
import android.provider.Telephony
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val context: ReactApplicationContext = reactContext

    override fun getName(): String {
        return "SmsModule"
    }

    @ReactMethod
    fun requestDefaultSmsApp() {
        val activity: Activity? = currentActivity
        if (activity != null) {
            val intent = Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT)
            intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, context.packageName)
            activity.startActivity(intent)
        }
    }
}
