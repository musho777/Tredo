const initialState = {
  data: [],
};
const SmsSinglPageReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'SmsSingPage':
      action.data.map((elm, i) => {
        item.data.push(elm)
      })

      break;
    default:
      break;
  }
  return item;
};
export default SmsSinglPageReducer;
