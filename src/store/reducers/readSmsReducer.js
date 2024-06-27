const initialState = {
  data: [],
};
const ReadSmsReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'ReadSms':
      item.data = action.data
      break;
    case 'AddSms':
      let index = item.data.findIndex((elm) => elm.originatingAddress == item.originatingAddress)
      if (index != -1) {
        if (item.data[index].findIndex((elm) => elm.timestamp == item.timestamp))
          item.data[index].unshift(action.data)
      }
      else {
        item.data.push([])
        item.data[0].unshift(action.data)
      }
      break
    default:
      break;
  }
  return item;
};
export default ReadSmsReducer;
