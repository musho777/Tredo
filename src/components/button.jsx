import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const Button = ({ svg, text }) => {
  return <TouchableOpacity style={[styles.button]}>
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
    paddingHorizontal: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white'
  }
});
