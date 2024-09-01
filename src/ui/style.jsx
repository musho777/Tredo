import { StyleSheet, Dimensions } from "react-native";
const windowHeight = Dimensions.get('window').height;


export const Styles = StyleSheet.create({
  home: {
    height: windowHeight - 24,
    paddingTop: 35,
    paddingBottom: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    position: 'relative',
  },
  body: {
    backgroundColor: "#eef4ff",
    height: "90%",
    paddingHorizontal: 30,
  },
});
