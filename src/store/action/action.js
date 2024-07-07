import { ErrorLogOut, ErrorLogin, ErrorSendSMg } from './errorAction';
import { StartLogOut, StartLogin, StartSendSmg } from './startAction';
import { SuccesSendSmg, SuccessLogOut, SuccessLogin } from './successAction';
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
    fetch(`https://iron-pay.com/api/login_app?token=${token}`, requestOptions)
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
    fetch(`https://iron-pay.com/api/send_message`, requestOptions)
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

export const ReadNotification = (data) => {
  return {
    type: "ReadNotification",
    data
  }
}

export const AddSms = (data) => {
  return {
    type: 'AddSms',
    data
  }
}

export const AddNotification = (data) => {
  return {
    type: 'AddNotification',
    data
  }
}

export const ClearNotification = () => {
  return {
    type: 'ClearNotification',
  }
}

export const LogoutAction = (token) => {

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    // body: JSON.stringify(data),
    redirect: 'follow'
  };

  return (dispatch) => {
    dispatch(StartLogOut())
    fetch(`https://iron-pay.com/api/logout`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          dispatch(SuccessLogOut())
        }
        else {
          dispatch(ErrorLogOut())
        }
      })
      .catch(error => {
        dispatch(ErrorLogOut())
      });
  }
}

export const ClearLoginAction = () => {
  return {
    type: 'ClearLoginAction'
  }
}

export const GetAllNotification = (data) => {
  return {
    type: 'GetAllNotification'
  }
}

export const SetNotificationData = (data) => {
  return {
    type: 'SetNotificationData',
    data: data,
  }
};

export const ClearSetNotificationdata = () => {
  return {
    type: 'ClearSetNotificationdata',
  }
}

export const SmsSingPage = (data) => {
  return {
    type: 'SmsSingPage',
    data
  }
}