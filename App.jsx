import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NativeModules } from 'react-native';

const { SmsModule } = NativeModules;
console.log(SmsModule, 'DefaultSMSModule')
const App = () => {
  const setAsDefaultSMSApp = () => {
    SmsModule.setAsDefaultSmsApp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Default SMS App</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={setAsDefaultSMSApp}
      >
        <Text style={styles.buttonText}>Set as Default SMS App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default App;
