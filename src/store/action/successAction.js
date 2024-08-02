export const SuccessLogin = (data) => {
  return {
    type: 'SuccessLogin',
    data
  }
}

export const SuccesSendSmg = (data) => {
  return {
    type: "SuccesSendSmg",
    data
  }
}
export const SuccessLogOut = (data) => {
  return {
    type: 'SuccessLogOut',
    data
  }
}

export const SuccessIsOnline = () => {
  return {
    type: 'SuccessIsOnline'
  }
}

export const SuccessAppVersion = (data) => {
  return {
    type: 'SuccessAppVersion',
    data
  }
}