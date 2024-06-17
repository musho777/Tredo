import { StyleSheet, Text, View } from "react-native"

export const AppInfo = ({ light, version = true }) => {
  return <View style={styles.appInfo}>
    <Text style={[styles.appName, light && { color: '#0068fa' }]}>Name</Text>
    <View style={styles.fingerprint}>
      <Text style={[styles.fingerprintText, light && { color: '#345591' }]}>Fingerprint:</Text>
      <Text style={styles.id}>1fb06850e0bb0b1c269ac1fd2cb6b1be</Text>
    </View>
    {version && <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <Text style={[styles.fingerprintText, light && { color: '#345591' }]}>Версия:</Text>
      <Text style={styles.id}>1.8.7</Text>
    </View>}
  </View>
}

const styles = StyleSheet.create({
  appInfo: {
    alignItems: 'center'
  },
  appName: {
    fontSize: 30,
    color: 'white',
    fontWeight: '600'
  },
  fingerprint: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
    gap: 4
  },
  fingerprintText: {
    color: "white"
  },
  id: {
    color: '#98b4e9'
  },
});
