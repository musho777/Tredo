import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native"
import ToggleSwitch from "toggle-switch-react-native"

export const AppsItem = ({ icon, label, value, packageName }) => {
  const [isEnabled, setIsEnabled] = useState();
  const toggleSwitch = async () => {
    let notData = await AsyncStorage.getItem('notData')
    let data = JSON.parse(notData)
    if (!isEnabled) {
      data.push(packageName)
    }
    else {
      let index = data.findIndex((elm) => elm == packageName)
      data.splice(index, 1)
    }
    await AsyncStorage.setItem('notData', JSON.stringify(data))

    setIsEnabled(previousState => !previousState);
  }

  useEffect(() => {
    setIsEnabled(value)
  }, [value])

  return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
      <Image style={{ width: 40, height: 40, resizeMode: 'center', }} source={{ uri: `data:image/png;base64,${icon}` }} />
      <Text style={{ color: 'black' }}>{label}</Text>
    </View>
    <View>
      <ToggleSwitch
        isOn={isEnabled}
        onColor="#006bf7"
        offColor="#c4d4f1"
        size='small'
        onToggle={isOn => toggleSwitch()}
        switchBorderRadius={10}
        trackOffStyle={{ width: 48, height: 27 }}
        trackOnStyle={{ width: 48, height: 27 }}
        thumbOffStyle={{ width: 20, height: 20, borderRadius: 50 }}
        thumbOnStyle={{ width: 20, height: 20, borderRadius: 50 }}
      />
    </View>

  </View>
}