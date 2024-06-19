import { NativeModules } from 'react-native';

const { SmsModule } = NativeModules;

export default {
  sendSms: (phoneNumber, message) => SmsModule.sendSms(phoneNumber, message),
};
