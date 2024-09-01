import { StyleSheet, Text, View } from "react-native"

export const Header = ({ count, title, text }) => {
  return <View style={styles.header}>
    <Text style={styles.AllSms}>{title}</Text>
    <View style={styles.smsCount}>
      <Text style={styles.AllSms1}>{text}:{count}</Text>
    </View>
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
