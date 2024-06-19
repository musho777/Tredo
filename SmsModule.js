import { NativeModules } from 'react-native';

const { SmsModule } = NativeModules;

// Call this function to set your app as the default SMS app
const setAsDefaultSMSApp = () => {
  SmsModule.setAsDefaultSmsApp();
};
