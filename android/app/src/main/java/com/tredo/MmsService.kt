package com.tredo

import android.service.carrier.CarrierMessagingService
import android.util.Log

class MmsService : CarrierMessagingService() {
    // override fun onSendMms(
    //     config: SendMmsConfig,
    //     pdu: ByteArray,
    //     location: String,
    //     callback: SendMmsCallback
    // ) {
    //     Log.d("MmsService", "onSendMms called")
        
    //     // Handle sending MMS here
    //     callback.onSendMmsComplete(CarrierMessagingService.SEND_STATUS_OK, null)
    // }

    // override fun onDownloadMms(
    //     messageId: String,
    //     location: String,
    //     carrierMmsDownloadHandler: CarrierMmsDownloadHandler
    // ) {
    //     Log.d("MmsService", "onDownloadMms called")

    //     // Handle downloading MMS here
    //     carrierMmsDownloadHandler.onDownloadMmsComplete(CarrierMessagingService.DOWNLOAD_STATUS_OK)
    // }
}
