import { Linking, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Button } from "../components/button";
import { useEffect, useState } from "react";
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { QrSvg, ShareSvg } from "../../assets/svg";
import DeviceInfo from "react-native-device-info";
import * as RNLocalize from 'react-native-localize';
import NetInfo from '@react-native-community/netinfo';



export const Home = ({ navigation }) => {

  const [appVersion, setAppVersion] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [deviceName, setDeviceName] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [value, setValue] = useState("")
  const [osVersion, setOsVersion] = useState(null);
  const [networkState, setNetworkState] = useState('');
  const [permissionStatus, setPermissionStatus] = useState([]);



  console.log(deviceFingerprint, 'deviceFingerprint')

  useEffect(() => {
    const fetchAppVersion = async () => {
      const version = await DeviceInfo.getVersion();
      const uniqueId = await DeviceInfo.getUniqueId();
      DeviceInfo.getDeviceName().then((r) => {
        setDeviceName(r);
      });
      const os = await DeviceInfo.getSystemVersion();
      setOsVersion(os);

      const country = await RNLocalize.getCountry();
      setCountryName(country);
      setAppVersion(version);
      setDeviceFingerprint(uniqueId);
    };

    fetchAppVersion();


    const handleConnectivityChange = (isConnected) => {
      setNetworkState(isConnected);
    };


    const unsubscribe = NetInfo.addEventListener(state => {
      console.log(state.type, 'state')
      handleConnectivityChange(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);



  const sendEmail = async () => {
    // let comment = `
    //   DEVICE_ID = ${deviceFingerprint}
    //   VERSION_NAME = ${appVersion}
    //   VERSION_CODE = 34
    //   DEVICE = ${deviceName}
    //   BRAND = google
    //   COUNTRY = ${countryName}
    //   DENSITY = xxxhdpi
    //   OS_VERSION = ${osVersion}
    //   IS_LOGGED_IN = false
    //   HAS_PERMS = false
    //   NETWORK_STATE = ${networkState}
    //   PERMISSION_STATE_LIST:
    //   {
    //       android.permission.ACCESS_NOTIFICATION_POLICY,
    //       isOptimizationSupported
    //   } 
    // `

    const comment = `
    ===============USER INFO===============
    DEVICE_ID=${encodeURIComponent(deviceFingerprint)}
    VERSION_NAME=${encodeURIComponent(appVersion)}
    VERSION_CODE=34
    DEVICE=${encodeURIComponent(deviceName)}
    BRAND=google
    COUNTRY=${encodeURIComponent(countryName)}
    DENSITY=xxxhdpi
    OS_VERSION=${encodeURIComponent(osVersion)}
    IS_LOGGED_IN=false
    HAS_PERMS=false
    NETWORK_STATE=${encodeURIComponent(networkState)}
    PERMISSION_STATE_LIST:
    {
        android.permission.ACCESS_NOTIFICATION_POLICY,
        isOptimizationSupported
    }
`;

    const subject = 'User Info';
    const emailAddress = 'youremail@example.com';
    const url = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(comment)}`;
    // const url = `mailto:${emailAddress}?body=${comment}`;
    await Linking.openURL(url);
  };

  return <LinearGradient colors={['#3281f0', '#2f5bb2']} >
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor="white" />
    <ScrollView>
      <View style={Styles.home}>
        <AppInfo />
        <View>
          <View>
            <Text style={{ color: 'white', fontSize: 25, textAlign: 'center', fontFamily: 'RobotoCondensed-Bold', marginBottom: 5 }}>Авторизация устройства</Text>
            <Text style={[{ textAlign: 'center', fontSize: 13, color: '#98b4e9', fontFamily: 'RobotoCondensed-Regular', paddingHorizontal: 18, }]}>Введите секретный ключ для подключения устройства к приложению</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Button svg={<QrSvg />} text={"Войти по QR"} />
            {/* <Button onPress={() => sendEmail()} svg={<ShareSvg />} text={"Отправить логи"} /> */}
          </View>
          <View style={styles.buttonView}>
            <View style={{ gap: 10 }}>
              <Text style={{ color: 'white', fontFamily: 'RobotoCondensed-Regular' }}>Секретный ключ</Text>
              <TextInput placeholderTextColor="#628bdc" value={value} placeholder="#" onChange={(e) => setValue(e)} style={styles.Input} />
            </View>
            <Button2 onPress={() => navigation.navigate("permission")} />
          </View>
        </View>
      </View>
    </ScrollView>
  </LinearGradient >

}

const styles = StyleSheet.create({
  buttonWrapper: {
    gap: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  Input: {
    borderWidth: 1,
    borderColor: '#628bdc',
    borderRadius: 10,
    paddingVertical: 15,
    fontSize: 20,
    backgroundColor: '#3968bf',
    color: '#78a7ff',
    paddingHorizontal: 20,
    fontFamily: 'RobotoCondensed-Regular',
  },
  buttonView: {
    gap: 20,
    marginTop: 40
  },
});
