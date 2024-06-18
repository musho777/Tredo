import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const Button = ({ svg, text, onPress = () => { } }) => {
  return <TouchableOpacity onPress={() => onPress()} style={[styles.button]}>
    <View>
      {svg}
    </View>
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3282f1",
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    fontSize: 15,
    fontFamily: 'RobotoCondensed-SemiBold',
    color: 'white'
  }
});
