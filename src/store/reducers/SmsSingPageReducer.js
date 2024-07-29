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
      if (index != -1) {
        if (action.status == 1) {
          item.data[index].status = 1
        }
        else if (action.status == 2) {
          item.data[index].status = 2
        }
        else {
          item.data[index].status = 0
        }
      }
      break
    case 'AddNewSms':
      if (item?.data[0]?.user_id == action.data.user_id) {
        item.data.unshift(action.data)
      }
    default:
      break;
  }
  return item;
};
export default SmsSinglPageReducer;
