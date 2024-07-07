const initialState = {
  data: [],
};
const NotificationReducer = (state = initialState, action) => {
  let item = { ...state };
  switch (action.type) {
    case 'ReadNotification':
      item.data = action.data
      break;
    case 'AddNotification':
      let index = -1
      let shouldStop = false;
      item.data?.map((elm, i) => {
        if (shouldStop) return;
        if (elm.findIndex((el) => el.originatingAddress == action.data.originatingAddress) > -1) {
          index = i
        }
        if (index > -1) {
          shouldStop = true;
          return
        }
      })
      if (index != -1) {
        if (item.data[index].findIndex((elm) => elm.timestamp == action.data.timestamp)) {
          item.data[index].unshift(action.data)
          let newArr = item.data[index]
          item.data.splice(index, 1)
          item.data.unshift(newArr)
        }
      }
      else {
        item.data.unshift([])
        item.data[0].unshift(action.data)
      }
      break

    default:
      break;
  }
  return item;
};
export default NotificationReducer;
