export const ErrorLogin = () => {
  return {
    type: "ErrorLogin"
  }
}

export const ErrorSendSMg = (error) => {
  return {
    type: "ErrorSendSMg",
    error
  }
}

export const ErrorLogOut = () => {
  return {
    type: 'ErrorLogOut'
  }
}

export const ErrorIsOnline = () => {
  return {
    type: 'ErrorIsOnline'
  }
}