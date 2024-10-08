import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native"
import DeviceInfo from "react-native-device-info";

export const AppInfo = ({ light, version = true }) => {
  const [appVersion, setAppVersion] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState('');


  useEffect(() => {
    const fetchAppVersion = () => {
      // const version = DeviceInfo.getVersion();
      const uniqueId = DeviceInfo.getUniqueId();
      // setAppVersion(version);
      setDeviceFingerprint(uniqueId);
    };

    fetchAppVersion();
  }, []);

  return <View style={styles.appInfo}>
    <Text style={[styles.appName, light && { color: '#0068fa' }]}>LightPay</Text>
    <View style={styles.fingerprint}>
      <Text style={[styles.fingerprintText, light && { color: '#345591' }]}>Fingerprint:</Text>
      <Text style={styles.id}>{deviceFingerprint}</Text>
    </View>
    {version && <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <Text style={[styles.fingerprintText, light && { color: '#345591' }]}>Версия:</Text>
      <Text style={styles.id}>1.5</Text>
    </View>}
  </View>
}

const styles = StyleSheet.create({
  appInfo: {
    alignItems: 'center'
  },
  appName: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold'
  },
  fingerprint: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
    gap: 4
  },
  fingerprintText: {
    color: "white",
    fontFamily: 'RobotoCondensed-Regular'
  },
  id: {
    color: '#98b4e9',
    fontFamily: 'RobotoCondensed-Regular'
  },
});
