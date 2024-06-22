import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"
import SmsAndroid from 'react-native-get-sms-android';
import { MsgBody } from "../components/msgBody";


export const SmsPage = () => {

  const [sms, setSms] = useState([])

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
        var arr = JSON.parse(smsList);
        let a = Object.values(arr.reduce((acc, message) => {
          const address = message.address;
          if (!acc[address]) {
            acc[address] = [];
          }
          acc[address].push(message);
          return acc;
        }, {}));
        console.log(a.length)
        setSms(a)

      }
    )
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
        return <MsgBody data={elm} key={i} />
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
