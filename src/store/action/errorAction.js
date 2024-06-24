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