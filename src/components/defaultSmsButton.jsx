import { NativeModules, Text, TouchableOpacity } from "react-native"
import { addSmsPermissionListener, requestDefaultSmsPermission } from "./SmsDefaultHandler";
import { useEffect, useState } from "react";

export const DefaultSmsButton = () => {

  const { SmsDefaultHandler } = NativeModules;
  const [isDefaultSmsApp, setIsDefaultSmsApp] = useState(false);
  const [check, setCheck] = useState(0)

  useEffect(() => {
    const listener = addSmsPermissionListener((message) => {
      if (message == 'Success requesting ROLE_SMS!') {
        console.log("yess")
        setCheck(true)
      }
      else {
        setCheck(false)
      }
    });
    return () => {
      listener.remove();
    };
  }, []);





  const handlePermissionRequest = async () => {
    requestDefaultSmsPermission();
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