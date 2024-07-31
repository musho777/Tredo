const initialState = {
  data: [],
  count: null
};
const ReadSmsReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'ReadSms':
      action.data.map((elm, i) => {
        if (item.data.findIndex((el) => el.username == elm.username) == -1) {
          item.data.push(elm)
        }
      })
      break;
    case 'AddSms':
      let index = item.data.findIndex((elm) => elm.username == action.data.username)
      let count = 1
      if (action.data.sms_count) {
        count = item.data[index].sms_count + 1
      }
      else {
        action.data.sms_count = action.data.count
      }
      if (index != -1) {
        item.data.splice(index, 1)
      }
      item.data.unshift(action.data)
      break
    case 'ClearAllSms':
      item.data = []
      item.count = 0
      break
    case 'Count':
      item.count = action.count
      break
    case 'AddCount':
      item.count = item.count + 1
      break
    default:
      break;
  }
  return item;
};
export default ReadSmsReducer;
