import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk"
import LoginReducer from './reducers/loginReducer';


const rootReducer = combineReducers({
  login: LoginReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
