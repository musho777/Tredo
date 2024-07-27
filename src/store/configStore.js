import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk"
import LoginReducer from './reducers/loginReducer';
import ReadSmsReducer from './reducers/readSmsReducer';
import SmsSinglPageReducer from './reducers/SmsSingPageReducer';


const rootReducer = combineReducers({
  login: LoginReducer,
  readSms: ReadSmsReducer,
  smsSinglPage: SmsSinglPageReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
