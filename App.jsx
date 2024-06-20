import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert, View } from 'react-native';
import { Navigation } from './navigation';

const requestPhonePermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: "Phone State Permission",
          message:
            "This app needs access to your phone state to make and manage phone calls.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      const granted3 = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          // PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS
        ],
        {
          title: "Audio Permission",
          message:
            "This app needs access to your microphone to record audio.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      const granted4 = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA
        ],
        {
          title: "Media Permissions",
          message: "This app needs access to your photos, videos, and camera to function properly.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      console.log(granted4, 'granted4')
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message:
            "This app needs access to your camera to take photos.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the phone state");
      } else {
        console.log("Phone state permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

const App = () => {
  // useEffect(() => {
  //   requestPhonePermissions();
  // }, []);

  return (
    <Navigation />
  );
};

export default App;
