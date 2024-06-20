import axios from 'axios'
import { ErrorLogin } from './errorAction';
import { StartLogin } from './startAction';
import { SuccessLogin } from './successAction';
export const LoginAction = (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-App-Client': 'MyReactNativeApp'
  };
  var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  return (dispatch) => {
    dispatch(StartLogin())
    fetch(`https://projectx.digiluys.com/api/login?token=${token}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          console.log(result)
          dispatch(SuccessLogin(result))
        }
        else {
          dispatch(ErrorLogin())
        }
      })
      .catch(error => {
        dispatch(ErrorLogin())
      });
  }
}