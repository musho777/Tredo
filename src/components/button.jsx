import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const Button = ({ svg, text, width = '49%', bg = "#3282f1", onPress = () => { } }) => {
  return <TouchableOpacity onPress={() => onPress()} style={[styles.button, { width: width, backgroundColor: bg }]}>
    <View>
      {svg}
    </View>
    <Text style={[styles.text, bg == "#3282f1" ? { color: 'white' } : { color: '#335796' }]}>{text}</Text>
  </TouchableOpacity>
}
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    width: 200,
    flexDirection: 'row',
    gap: 3,
  },
  text: {
    fontSize: 13,
    fontFamily: 'RobotoCondensed-Medium',
    color: 'white'
  }
});
