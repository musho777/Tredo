const initialState = {
  online: 1
};
const IsOnlineReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'SuccessIsOnline':
      item.online = 1
      break;
    case 'SuccessLogin':
      item.online = 1
      break
    case 'ErrorIsOnline':
      item.online = 0
      break;
    default:
      break;
  }
  return item;
};
export default IsOnlineReducer;
