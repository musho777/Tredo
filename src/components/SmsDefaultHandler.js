import { NativeModules, NativeEventEmitter } from 'react-native';

const { SmsDefaultHandler } = NativeModules;
const SmsDefaultHandlerEmitter = new NativeEventEmitter(SmsDefaultHandler);

export const requestDefaultSmsPermission = () => {
  SmsDefaultHandler.requestDefaultSmsPermission();
};

export const addSmsPermissionListener = (callback) => {
  return SmsDefaultHandlerEmitter.addListener('SmsPermissionEvent', callback);
};
