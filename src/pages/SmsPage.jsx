import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { MsgBody } from "../components/msgBody";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { ReadSms } from "../store/action/action";
import SmsListener from 'react-native-android-sms-listener'
import PushNotification from 'react-native-push-notification';





export const SmsPage = () => {

  const [sms, setSms] = useState([])
  const readSms = useSelector((st) => st.readSms)
  const dispatch = useDispatch()

  const Readsms_list = async () => {
    // await AsyncStorage.removeItem('sms')
    let arr = await AsyncStorage.getItem('sms')
    let a = arr ? Object.values(JSON.parse(arr)?.reduce((acc, message) => {
      const address = message.address;
      if (!acc[address]) {
        acc[address] = [];
      }
      acc[address].push(message);
      return acc;
    }, {})) : [];
    dispatch(ReadSms(a))
  }


  useEffect(() => {
    Readsms_list()
  }, [])

  useEffect(() => {
    setSms(readSms.data)
  }, [readSms.data])


  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Все сообщения</Text>
      <View style={styles.smsCount}>
        <Text style={styles.AllSms1}>Всего сообщений:</Text>
        <Text style={styles.AllSms1}>{sms?.length}</Text>
      </View>
    </View>
    <ScrollView style={styles.body} >
      {sms.map((elm, i) => {
        return <MsgBody last={i == readSms?.data - 1} data={elm} key={i} />
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
