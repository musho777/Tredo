import { useEffect, useState } from "react";
import { FlatList, View } from "react-native"
import { MsgBody } from "../components/msgBody";
import { useSelector } from "react-redux";
import { getPaginatedUsers } from "../func/function";
import { Header } from "../components/header";
import { Styles } from "../ui/style";

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
    if (item.type == route.params.type || !item.type) {
      return <MsgBody type={route.params.type} last={index == sms.length - 1} data={item} key={index} />
    }
  }

  return <View>
    <Header
      count={readSms.count}
      title={'Все сообщения'}
      text={'Всего сообщений'}
    />
    <FlatList
      data={sms}
      renderItem={renderItem}
      onEndReached={() => setPage(page + 1)}
      style={Styles.body} >
    </FlatList>
  </View>
}