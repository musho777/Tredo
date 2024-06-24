package com.tredo

import android.app.Activity
import android.app.role.RoleManager
import android.content.Intent
import android.os.Build
import android.provider.Telephony
import androidx.annotation.NonNull
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class SmsDefaultHandlerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val REQUEST_CODE_SET_DEFAULT_SMS = 1001
    private val ROLE_SMS = RoleManager.ROLE_SMS

    init {
        reactContext.addActivityEventListener(object : BaseActivityEventListener() {
            override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
                if (requestCode == REQUEST_CODE_SET_DEFAULT_SMS) {
                    if (resultCode == Activity.RESULT_OK) {
                        sendEvent("SmsPermissionEvent", "Success requesting ROLE_SMS!")
                    } else {
                        sendEvent("SmsPermissionEvent", "Failed requesting ROLE_SMS")
                    }
                }
            }
        })
    }

    @NonNull
    override fun getName(): String {
        return "SmsDefaultHandler"
    }

    @ReactMethod
    fun requestDefaultSmsPermission() {
        val currentActivity = currentActivity ?: return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val roleManager = currentActivity.getSystemService(RoleManager::class.java) ?: return
            if (roleManager.isRoleAvailable(ROLE_SMS) && !roleManager.isRoleHeld(ROLE_SMS)) {
                val roleRequestIntent = roleManager.createRequestRoleIntent(ROLE_SMS)
                currentActivity.startActivityForResult(roleRequestIntent, REQUEST_CODE_SET_DEFAULT_SMS)
            }
        } else {
            val intent = Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT)
            intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, reactContext.packageName)
            currentActivity.startActivityForResult(intent, REQUEST_CODE_SET_DEFAULT_SMS)
        }
    }

    private fun sendEvent(eventName: String, message: String) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, message)
    }

    // Add the required methods
    @ReactMethod
    fun addListener(eventName: String) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Remove upstream listeners, stop unnecessary background tasks
    }
}
