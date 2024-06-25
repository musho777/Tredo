import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AllMsgBody } from "../components/AllMsgBody";
import { ClearSvg, SearchSvg } from "../../assets/svg";


export const AllMsg = ({ route }) => {
  const [sms, setSms] = useState()
  const [value, setValue] = useState('')
  useEffect(() => {
    setSms(route.params.data)
  }, [])

  const SearchMsg = (search) => {
    let item = [...sms]
    let newArr = []

    item.map((elm, i) => {
      if (elm.body.includes(search)) {
        newArr.push(elm)
      }
    })
    if (search == '') {
      setValue('')
      setSms(route.params.data)
    }
    else {
      setValue(search)
      setSms(newArr)
    }
  }


  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Отправитель: </Text>
      <View style={styles.smsCount}>
        <Text style={styles.AllSms1}>Сообщений от отправителя: {sms?.length && sms[0]?.originatingAddress}</Text>
        <Text style={styles.AllSms1}>{route.params.data?.length}</Text>
      </View>
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
    <ScrollView style={styles.body} >
      {sms?.map((elm, i) => {
        return <AllMsgBody index={i} last={i == route.params.data.length - 1} data={elm} key={i} />
      })}
    </ScrollView>
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
  smsCount: {
    flexDirection: 'row',
  }
});
