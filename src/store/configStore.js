import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk"
import LoginReducer from './reducers/loginReducer';
import SendSmsReducer from './reducers/sendSmsReducer';
import ReadSmsReducer from './reducers/readSmsReducer';


const rootReducer = combineReducers({
  login: LoginReducer,
  sendSms: SendSmsReducer,
  readSms: ReadSmsReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
