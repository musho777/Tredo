import { NativeModules, Text, TouchableOpacity } from "react-native"
import { requestDefaultSmsPermission } from "./SmsDefaultHandler";
import { useEffect, useState } from "react";

export const DefaultSmsButton = () => {

  const { SmsDefaultHandler } = NativeModules;
  const [isDefaultSmsApp, setIsDefaultSmsApp] = useState(false);
  const [check, setCheck] = useState(0)


  const handlePermissionRequest = async () => {
    requestDefaultSmsPermission();
    let time = setTimeout(() => {
      setCheck(true)
    }, 1500)
    clearTimeout(time)
  };

  useEffect(() => {
    SmsDefaultHandler?.isDefaultSmsApp().then((result) => {
      if (result) {
        setIsDefaultSmsApp(false)
      }
      else {
        setCheck(false)
        setIsDefaultSmsApp(true)
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [check])


  if (isDefaultSmsApp) {
    return <TouchableOpacity onPress={() => handlePermissionRequest()} style={{ backgroundColor: "#c2c2c2", justifyContent: 'center', alignItems: 'center', paddingVertical: 20, marginTop: 20, borderRadius: 10 }}>
      <Text style={{ textAlign: 'center', color: "black", fontFamily: 'RobotoCondensed-Regular', }}>СДЕЛАТЬ ДЕФОЛТНЫМ</Text>
    </TouchableOpacity>
  }
}