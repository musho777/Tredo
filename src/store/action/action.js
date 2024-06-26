import { ErrorLogin, ErrorSendSMg } from './errorAction';
import { StartLogin, StartSendSmg } from './startAction';
import { SuccesSendSmg, SuccessLogin } from './successAction';
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

export const SendSmgAction = (token, data) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  return (dispatch) => {
    dispatch(StartSendSmg())
    fetch(`https://projectx.digiluys.com/api/send_message`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          dispatch(SuccesSendSmg(result.data))
        }
        else {
          dispatch(ErrorSendSMg())
        }
      })
      .catch(error => {
        dispatch(ErrorSendSMg(error))
      });
  }
}

export const ClearSendSms = () => {
  return {
    type: "ClearSendSmS"
  }
}

export const ReadSms = (data) => {
  return {
    type: "ReadSms",
    data
  }
}

export const AddSms = (data) => {
  return {
    type: 'AddSms',
    data
  }
}