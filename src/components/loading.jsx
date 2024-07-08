import { ActivityIndicator, StyleSheet, View } from "react-native"

export const Loading = ({ loading }) => {
  if (loading) {
    return <View style={styles.refresh}>
      <ActivityIndicator size="large" color="#3282f1" />
    </View>
  }
}

const styles = StyleSheet.create({
  refresh: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: 10,
    left: 20
  },
})