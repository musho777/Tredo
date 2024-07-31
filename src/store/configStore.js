import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk"
import LoginReducer from './reducers/loginReducer';
import ReadSmsReducer from './reducers/readSmsReducer';
import SmsSinglPageReducer from './reducers/SmsSingPageReducer';
import IsOnlineReducer from './reducers/isOnlineReducer';


const rootReducer = combineReducers({
  login: LoginReducer,
  readSms: ReadSmsReducer,
  smsSinglPage: SmsSinglPageReducer,
  isOnlie: IsOnlineReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
