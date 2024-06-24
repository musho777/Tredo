import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk"
import LoginReducer from './reducers/loginReducer';
import SendSmsReducer from './reducers/sendSmsReducer';


const rootReducer = combineReducers({
  login: LoginReducer,
  sendSms: SendSmsReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
