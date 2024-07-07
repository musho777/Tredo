import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk"
import LoginReducer from './reducers/loginReducer';
import SendSmsReducer from './reducers/sendSmsReducer';
import ReadSmsReducer from './reducers/readSmsReducer';
import LogoutReducer from './reducers/logoutReducer';
import SetNotificationDataReducer from './reducers/SetNotificationDataReducer';
import SmsSinglPageReducer from './reducers/SmsSingPageReducer';
import NotificationReducer from './reducers/notificationReducer';


const rootReducer = combineReducers({
  login: LoginReducer,
  sendSms: SendSmsReducer,
  readSms: ReadSmsReducer,
  logout: LogoutReducer,
  setNotificationData: SetNotificationDataReducer,
  smsSinglPage: SmsSinglPageReducer,
  notification: NotificationReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
