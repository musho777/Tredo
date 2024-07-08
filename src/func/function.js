import AsyncStorage from "@react-native-async-storage/async-storage";

export const sendMessage = async (message) => {
  console.log("------")
  let confirm = false
  let token = await AsyncStorage.getItem('token')
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      title: message.originatingAddress,
      unix: message.timestamp,
      message: message.body
    }),
    redirect: 'follow'
  };

  await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result, '111-----')
      if (result.status) {
        confirm = true
      }
      else {
        confirm = false
      }
    })
    .catch(error => {
      confirm = false
    });
  return confirm
}
