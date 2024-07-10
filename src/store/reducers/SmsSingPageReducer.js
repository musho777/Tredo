const initialState = {
  data: [],
};
const SmsSinglPageReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'SmsSingPage':
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
export default SmsSinglPageReducer;
