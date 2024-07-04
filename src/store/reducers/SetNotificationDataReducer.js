const initialState = {
  error: false,
  loading: false,
  data: null,
  status: false,
};
const SetNotificationDataReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'SetNotificationData':
      item.error = false;
      item.loading = true;
      item.data = action.data
      item.status = false
      break;
    default:
      break;
  }
  return item;
};
export default SetNotificationDataReducer;
