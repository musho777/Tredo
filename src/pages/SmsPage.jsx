import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"
import SmsAndroid from 'react-native-get-sms-android';
import { MsgBody } from "../components/msgBody";
import SmsListener from 'react-native-android-sms-listener'
import AsyncStorage from "@react-native-async-storage/async-storage";



export const SmsPage = () => {

  const [sms, setSms] = useState([])

  const setItem = async (message) => {
    let sms = await AsyncStorage.getItem('sms')
    if (sms) {
      let item = JSON.parse(await AsyncStorage.getItem('sms'))
      item.unshift(message)
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
    else {
      let item = []
      item.unshift(message)
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
  }
  SmsListener.addListener(message => {
    setItem(message)
  })

  const Readsms_list = async () => {
    let arr = await AsyncStorage.getItem('sms')
    let a = Object.values(JSON.parse(arr).reduce((acc, message) => {
      const address = message.address;
      if (!acc[address]) {
        acc[address] = [];
      }
      acc[address].push(message);
      return acc;
    }, {}));
    setSms(a)
  }


  useEffect(() => {
    Readsms_list()
  }, [])

  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Все сообщения</Text>
      <View style={styles.smsCount}>
        <Text style={styles.AllSms1}>Всего сообщений:</Text>
        <Text style={styles.AllSms1}>{sms.length}</Text>
      </View>
    </View>
    <ScrollView style={styles.body} >
      {sms.map((elm, i) => {
        console.log(elm)
        return <MsgBody last={i == sms.length - 1} data={elm} key={i} />
      })}
    </ScrollView>
  </View>
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgb(249,249,249)',
    height: '15%',
    width: '100%',
    justifyContent: 'flex-end',
    gap: 5,
    paddingBottom: 15,
    paddingHorizontal: 30,
  },
  body: {
    backgroundColor: "#eef4ff",
    height: "90%",
    paddingHorizontal: 30,
  },
  AllSms: {
    color: '#236fe1',
    fontSize: 20,
    fontFamily: 'RobotoCondensed-Medium',
  },
  AllSms1: {
    color: '#6e90d4',
    fontSize: 16,
    fontFamily: 'RobotoCondensed-Medium',
  },
  smsCount: {
    flexDirection: 'row'
  }
});
