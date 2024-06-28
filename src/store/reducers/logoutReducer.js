const initialState = {
  error: false,
  status: false,
  loading: false,
  data: null,
};
const LogoutReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'StartLogOut':
      item.status = false;
      item.error = false;
      item.loading = true;
      item.data = null
      break;
    case 'SuccessLogOut':
      item.status = true;
      item.error = false;
      item.loading = false;
      item.data = action.data

      break;
    case 'ErrorLogOut':
      item.error = true;
      item.loading = false;
      item.status = false;
      item.data = null
      break;
    default:
      break;
  }
  return item;
};
export default LogoutReducer;
