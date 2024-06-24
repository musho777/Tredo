const initialState = {
  error: false,
  loading: false,
  data: null,
  status: false,
};
const SendSmsReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'StartSendSmg':
      item.error = false;
      item.loading = true;
      item.data = null
      item.status = false
      break;
    case 'SuccesSendSmg':
      item.error = false;
      item.loading = false;
      item.data = action.data
      item.status = true
      break;
    case 'ErrorSendSMg':
      item.error = true;
      item.loading = false;
      item.data = null
      item.status = false
      break;
    case 'ClearSendSms':
      item.error = ''
      item.loading = false
      item.data = null
      item.status = false
      break
    default:
      break;
  }
  return item;
};
export default SendSmsReducer;
