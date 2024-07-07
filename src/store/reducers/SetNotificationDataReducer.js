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
    case 'ClearSetNotificationdata':
      item.error = false;
      item.loading = true;
      item.data = null
      item.status = false
      break
    case 'ClearNotification':
      item.data = null
      break
    default:
      break;
  }
  return item;
};
export default SetNotificationDataReducer;
