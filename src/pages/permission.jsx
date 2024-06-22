import { PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, View, Linking, NativeModules, Platform } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { Switch } from "../components/switch";
import { useEffect } from "react";
import { request, PERMISSIONS } from 'react-native-permissions';
import SmsAndroid from 'react-native-get-sms-android';


const { SmsModule } = NativeModules;
export const Permission = ({ navigation }) => {





  useEffect(() => {
    request(PERMISSIONS.ANDROID.SEND_SMS).then((r) => {
    });
    request(PERMISSIONS.ANDROID.READ_PHONE_STATE).then((r) => {
    });
    // Request other permissions as needed
  }, []);




  var filter = {
    box: 'inbox',
  };

  const Readsms_list = async () => {
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        // console.log('Count: ', count);
        // console.log('List: ', smsList);
        var arr = JSON.parse(smsList);
        arr.forEach(function (object) {
          // 'Object: ' +
          // console.log(object);
          // console.log('-->' + object.date);
          // console.log('-->' + object.body);
        });
      }
    )
  }


  const requestPhonePermissions = async () => {
    if (Platform.OS === 'android') {
      SmsModule.requestDefaultSmsApp();
    }
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
        // const granted3 = await PermissionsAndroid.requestMultiple(
        //   [
        //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        //     // PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS
        //   ],
        //   {
        //     title: "Audio Permission",
        //     message:
        //       "This app needs access to your microphone to record audio.",
        //     buttonNeutral: "Ask Me Later",
        //     buttonNegative: "Cancel",
        //     buttonPositive: "OK"
        //   }
        // );
        // const granted4 = await PermissionsAndroid.requestMultiple(
        //   [
        //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //     PermissionsAndroid.PERMISSIONS.CAMERA
        //   ],
        //   {
        //     title: "Media Permissions",
        //     message: "This app needs access to your photos, videos, and camera to function properly.",
        //     buttonNeutral: "Ask Me Later",
        //     buttonNegative: "Cancel",
        //     buttonPositive: "OK"
        //   }
        // );
        // const granted1 = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.CAMERA,
        //   {
        //     title: "Camera Permission",
        //     message:
        //       "This app needs access to your camera to take photos.",
        //     buttonNeutral: "Ask Me Later",
        //     buttonNegative: "Cancel",
        //     buttonPositive: "OK"
        //   }
        // );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  async function requestSmsPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      ]);
      if (
        granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.SEND_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_CONTACTS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_CONTACTS'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  }


  const AllowSim = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
    }
    catch (err) {
    }
  }


  async function requestSmsPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_MMS,
      ]);
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    requestSmsPermissions();
    requestSmsPermissions()
    requestPhonePermissions()
  }, [])

  function setDefaultSmsApp() {
    if (Platform.OS === 'android') {
      const { SmsPackage } = NativeModules;
      SmsPackage.setDefaultSmsPackage();
    }
  }

  return <View style={[Styles.home, { justifyContent: 'flex-start', gap: 30 }]}>
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor='#f9f9f9' />
    <AppInfo light />
    <View >
      <Text style={styles.text}>Предоставьте приложению</Text>
      <Text style={[styles.text, { marginTop: -3 }]}>необходимые разрешения:</Text>
    </View>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20 }}>
        <Switch onSwitch={() => setDefaultSmsApp()} text="Сделать приложением SMS по-умолчанию" />
        <Switch onSwitch={() => AllowSim()} text="Доступ к информации о сим картах" />
        <Switch onSwitch={() => AllowSim()} text="Доступ к информации о состоянии телефона" />
        <Switch text="Активировать чтение пуш-уведомлений" />
      </View>
    </ScrollView>
    <View>
      <Button2 onPress={() => navigation.navigate("connection")} text={"Далее"} light />
    </View>
  </View>
}
const styles = StyleSheet.create({
  text: {
    color: '#2f508e',
    fontSize: 15,
    fontFamily: 'RobotoCondensed-SemiBold',
  }
});
