import { StyleSheet, Text, TouchableOpacity } from "react-native"

export const Button2 = ({ light, onPress = () => { } }) => {
  return <TouchableOpacity onPress={() => onPress()} style={[styles.button, light && { backgroundColor: "#006bf7" }]}>
    <Text style={[styles.buttonText, light && { color: "white" }]}>Подключить устройство</Text>
  </TouchableOpacity>
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#305bb1',
    fontSize: 17,
    fontFamily: 'RobotoCondensed-Medium',
  },
})