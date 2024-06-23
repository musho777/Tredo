package com.tredo

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.shell.MainReactPackage
import com.centaurwarchief.smslistener.SmsListenerPackage;

import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.tredo.sms.SmsPackage;
import java.util.Arrays
// import com.tredo.SmsPackageModule;

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              add(SmsPackage())
              SmsListenerPackage()
              // add(SmsListenerPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
        

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    
    // setContentView(R.layout.activity_main)

    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    //         if (!Telephony.Sms.getDefaultSmsPackage(this).equals(packageName)) {
    //             // Ask the user to set your app as the default SMS app
    //             val intent = Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT)
    //             intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, packageName)
    //             startActivityForResult(intent, 1)
    //         }
    //     }

    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }

  // override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
  //       super.onActivityResult(requestCode, resultCode, data)
  //       if (requestCode == 1) {
  //           // Handle result accordingly
  //       }
  //   }
    //  private fun sendSMS(phoneNumber: String, message: String) {
    //     val smsUri = Uri.parse("smsto:$phoneNumber")
    //     val smsIntent = Intent(Intent.ACTION_SENDTO, smsUri)
    //     smsIntent.putExtra("sms_body", message)
    //     startActivity(smsIntent)
    // }
    //  private fun readSMS() {
    //     val resolver: ContentResolver = contentResolver
    //     val uri = Uri.parse("content://sms/inbox")
    //     val cursor: Cursor? = resolver.query(uri, null, null, null, null)
    //     cursor?.use {
    //         while (it.moveToNext()) {
    //             val body: String = it.getString(it.getColumnIndexOrThrow("body"))
    //             // Process SMS message body here
    //         }
    //     }
    // }
}
