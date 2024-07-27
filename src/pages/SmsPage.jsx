import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native"
import { MsgBody } from "../components/msgBody";
import { useSelector } from "react-redux";
import { getPaginatedUsers } from "../func/function";

export const SmsPage = ({ route }) => {

  const [sms, setSms] = useState([])
  const readSms = useSelector((st) => st.readSms)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (page > 1) {
      getPaginatedUsers(route.params.type, page)
    }
  }, [page])


  useEffect(() => {
    setSms(readSms.data)
  }, [readSms.data])


  const renderItem = ({ item, index }) => {
    return <MsgBody type={route.params.type} last={index == sms.length - 1} data={item} key={index} />
  }

  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Все сообщения</Text>
      <View style={styles.smsCount}>
        <Text style={styles.AllSms1}>Всего сообщений:{readSms.count}</Text>
      </View>
    </View>
    <FlatList
      data={sms}
      renderItem={renderItem}
      onEndReached={() => setPage(page + 1)}
      style={styles.body} >
      {sms.map((elm, i) => {
        return <MsgBody last={i == sms.length - 1} data={elm} key={i} />
      })}
    </FlatList>
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
