import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native"

export const Button2 = ({ loading, title, light, onPress = () => { } }) => {
  return <TouchableOpacity disabled={loading} onPress={() => onPress()} style={[styles.button, light && { backgroundColor: "#006bf7" }]}>
    {loading && <ActivityIndicator size={'small'} color={'white'} />}
    <Text style={[styles.buttonText, light && { color: "white" }]}>{title}</Text>
  </TouchableOpacity>
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 30
  },
  buttonText: {
    color: '#305bb1',
    fontSize: 17,
    fontFamily: 'RobotoCondensed-Medium',
  },
})