import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AllMsgBody } from "../components/AllMsgBody";
import { ClearSvg, SearchSvg } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { ClearSinglPage } from "../store/action/action";
import { getSmsByUserId } from "../func/function";
import { Styles } from "../ui/style";


export const AllMsg = ({ route, navigation }) => {

  const [page, setPage] = useState(1)
  const username = route.params.username
  const [sms, setSms] = useState()
  const [value, setValue] = useState('')
  const smsSinglPage = useSelector((st) => st.smsSinglPage)
  const dispatch = useDispatch()

  useEffect(() => {
    if (smsSinglPage.data) {
      setSms(smsSinglPage.data)
    }
  }, [smsSinglPage])

  useEffect(() => {
    if (page > 1) {
      getSmsByUserId(page, 10, route.params.id)
    }
  }, [route.params.id, page])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setPage(1)
    });
    return unsubscribe;
  }, [navigation]);



  const renderItem = ({ item, index }) => {
    return <AllMsgBody username={username} index={smsSinglPage.count - index} last={index == sms?.length - 1} data={item} key={index} />
  }


  const SearchMsg = (e) => {
    dispatch(ClearSinglPage())
    getSmsByUserId(1, 10, route.params.id, e)
    setValue(e)
  }

  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Отправитель: {username}</Text>
      <Text style={styles.AllSms1}>Сообщений от отправителя: {smsSinglPage.count}</Text>
    </View>
    <View style={styles.block}>
      <View style={styles.inputView}>
        <View style={styles.searchSvg}>
          <SearchSvg />
        </View>
        <TextInput
          value={value}
          onChangeText={(e) => SearchMsg(e)}
          placeholder="Поиск по сообщениям#"
          style={styles.input}
        />
        <TouchableOpacity onPress={() => SearchMsg('')} style={[styles.searchSvg1]}>
          <ClearSvg />
        </TouchableOpacity>
      </View>
    </View>
    <FlatList style={Styles.body}
      data={sms}
      renderItem={renderItem}
      onEndReached={() => setPage(page + 1)}>
    </FlatList>
  </View>
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: 30,
    backgroundColor: "#eef4ff"
  },
  inputView: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 10,
  },
  searchSvg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 999,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSvg1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 999,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 40,
    color: '#000'
  },
  header: {
    backgroundColor: 'rgb(249,249,249)',
    height: '15%',
    width: '100%',
    justifyContent: 'flex-end',
    gap: 5,
    paddingBottom: 15,
    paddingHorizontal: 30,
    borderBottomColor: '#c3c3c3',
    borderBottomWidth: 2,
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
});
