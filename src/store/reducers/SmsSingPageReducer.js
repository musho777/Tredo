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
    case 'ClearSinglPage':
      item.data = []
      break
    case 'ChangeStatus':
      let index = item.data.findIndex((elm) => elm.sms_id == action.id)
      item.data[index].status = 1
      break
    case 'AddNewSms':
      item.data.unshift(action.data)
    default:
      break;
  }
  return item;
};
export default SmsSinglPageReducer;
