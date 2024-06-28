const initialState = {
  error: false,
  status: false,
  loading: false,
  data: null,
};
const LoginReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'StartLogin':
      item.status = false;
      item.error = false;
      item.loading = true;
      item.data = null
      break;
    case 'SuccessLogin':
      item.status = true;
      item.error = false;
      item.loading = false;
      item.data = action.data

      break;
    case 'ErrorLogin':
      item.error = true;
      item.loading = false;
      item.status = false;
      item.data = null
      break;
    case 'ClearLoginAction':
      item.error = false
      item.status = false
      item.loading = false
      item.data = null
      break
    default:
      break;
  }
  return item;
};
export default LoginReducer;
