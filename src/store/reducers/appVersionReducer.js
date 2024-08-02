const initialState = {
  version: false
};
const AppVersionReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'SuccessAppVersion':
      item.version = action.data
      break;
    default:
      break;
  }
  return item;
};
export default AppVersionReducer;
