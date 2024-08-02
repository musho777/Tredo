import { ErrorIsOnline, ErrorLogOut, ErrorLogin } from './errorAction';
import { StartLogOut, StartLogin } from './startAction';
import { SuccessIsOnline, SuccessLogOut, SuccessLogin } from './successAction';
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

export const LogoutAction = (token) => {

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
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



export const SmsSingPage = (data) => {
  return {
    type: 'SmsSingPage',
    data
  }
}


export const CheckOnline = (token) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  return (dispatch) => {
    fetch(`https://iron-pay.com/api/auth_user_info`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          dispatch(SuccessIsOnline())
        }
        else {
          dispatch(ErrorIsOnline())
        }
      })
      .catch(error => {
      });
  }
}

export const Count = (count) => {
  return {
    type: 'Count',
    count
  }
}

export const AddCount = () => {
  return {
    type: 'AddCount'
  }
}

export const ChangeStatus = (id, status) => {
  return {
    type: 'ChangeStatus',
    id,
    status
  }
}

export const ClearSinglPage = () => {
  return {
    type: 'ClearSinglPage'
  }
}

export const ClearAllSms = () => {
  return {
    type: 'ClearAllSms'
  }
}

export const AddNewSms = (data, id) => {
  return {
    type: 'AddNewSms',
    data,
  }
}

export const SinglSmsCount = (count) => {
  return {
    type: 'SinglSmsCount',
    count,
  }
}