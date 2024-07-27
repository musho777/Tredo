import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AllMsgBody } from "../components/AllMsgBody";
import { ClearSvg, SearchSvg } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import SQLite from 'react-native-sqlite-2';
import { ClearSinglPage, SmsSingPage } from "../store/action/action";


export const AllMsg = ({ route, navigation }) => {

  const db = SQLite.openDatabase('Tredo.db', '1.0', '', 1)
  const [page, setPage] = useState(1)

  const count = route.params.count
  const username = route.params.username

  const dispatch = useDispatch()

  const getSmsByUserId = (page = 1, pageSize = 10, userId) => {
    const offset = (page - 1) * pageSize;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SMS WHERE user_id = ? ORDER BY sent_at DESC LIMIT ? OFFSET ?',
        [userId, pageSize, offset],
        (tx, result) => {
          const messages = [];
          for (let i = 0; i < result.rows.length; i++) {
            messages.push(result.rows.item(i));
          }
          dispatch(SmsSingPage(messages))
        },
        (tx, error) => {
          console.error('Failed to get messages:', error.message);
        }
      );
    });
  };

  const [sms, setSms] = useState()
  const [value, setValue] = useState('')
  const smsSinglPage = useSelector((st) => st.smsSinglPage)


  useEffect(() => {
    if (smsSinglPage.data) {
      setSms(smsSinglPage.data)
    }
  }, [smsSinglPage])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setPage(1)
    });
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    getSmsByUserId(page, 10, route.params.id)
  }, [route.params.id, page])

  useEffect(() => {
    setSms([])
    dispatch(ClearSinglPage())
  }, [route.params.id])

  // const SearchMsg = (search) => {
  //   let item = [...sms]
  //   let newArr = []

  //   item.map((elm, i) => {
  //     if (elm.body.includes(search)) {
  //       newArr.push(elm)
  //     }
  //   })
  //   if (search == '') {
  //     setValue('')
  //     setSms(smsSinglPage.data)
  //   }
  //   else {
  //     setValue(search)
  //     setSms(newArr)
  //   }

  // }
  const renderItem = ({ item, index }) => {
    return <AllMsgBody username={username} type={route.params.type} index={index} last={index == sms?.length - 1} data={item} key={index} />
  }


  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Отправитель: {username}</Text>
      <Text style={styles.AllSms1}>Сообщений от отправителя: {count}</Text>
    </View>
    <View style={{ paddingHorizontal: 30, backgroundColor: "#eef4ff", }}>
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
    <FlatList style={styles.body}
      data={sms}
      renderItem={renderItem}
      onEndReached={() => {
        setPage(page + 1)
      }}
    >
    </FlatList>
  </View>
}

const styles = StyleSheet.create({
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
});
