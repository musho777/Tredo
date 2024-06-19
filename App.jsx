import React from 'react';
import { View, Button, TextInput } from 'react-native';
import SmsModule from './SmsModule';

const App = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [message, setMessage] = React.useState('');

  const sendSms = () => {
    SmsModule.sendSms(phoneNumber, message);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={{ marginBottom: 20, borderBottomWidth: 1, padding: 10 }}
      />
      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        style={{ marginBottom: 20, borderBottomWidth: 1, padding: 10 }}
      />
      <Button title="Send SMS" onPress={sendSms} />
    </View>
  );
};

export default App;
