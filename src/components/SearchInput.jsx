import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { ClearSvg, SearchSvg } from "../../assets/svg"

export const SearchInput = ({ SearchMsg, value }) => {
  return <View style={styles.block}>
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
