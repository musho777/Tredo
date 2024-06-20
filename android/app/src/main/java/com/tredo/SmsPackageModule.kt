package com.tredo

import android.app.Activity
import android.content.Intent
import android.provider.Telephony
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SmsPackageModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SmsPackage"
    }

    @ReactMethod
    fun setDefaultSmsPackage() {
        val activity: Activity? = currentActivity
        activity?.let {
            val intent = Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT)
            intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, reactContext.packageName)
            it.startActivity(intent)
        }
    }
}
