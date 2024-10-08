import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native'
import DeviceInfo from 'react-native-device-info';

export const Ping = ({ systemVersion }) => {

  const [pingResult, setPingTime] = useState(null);

  const fetchPingTime = async () => {
    const startTime = Date.now();
    try {
      await fetch('https://www.google.com', { method: 'HEAD' });
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setPingTime(timeTaken);
    } catch (error) { }
  };

  useEffect(() => {
    fetchPingTime()
  }, []);

  return <View style={{ alignItems: 'center' }}>
    <Image style={styles.image} source={require('../../assets/image/radio.png')} />
    <View style={styles.textWrapper}>
      <Text style={styles.text1}>Устройство подключено</Text>
      <Text style={styles.text2}>Пинг: {pingResult} мс</Text>
      <Text style={styles.text2}>Версия: Android {DeviceInfo.getSystemVersion()}</Text>
    </View>
  </View>
}

const styles = StyleSheet.create({
  textWrapper: {
    marginTop: 20,
    alignItems: 'center',
    gap: 7,
  },
  text1: {
    color: '#2f508e',
    fontSize: 20,
    fontFamily: 'RobotoCondensed-Regular',
  },
  text2: {
    color: '#5e86cf',
    fontSize: 14,
    fontFamily: 'RobotoCondensed-Regular'
  },
  image: {
    width: 100,
    height: 100
  },
})