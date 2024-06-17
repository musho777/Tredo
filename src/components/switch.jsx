import { Text, View } from "react-native"
import ToggleSwitch from "toggle-switch-react-native"
import { MsgSvg } from "../../assets/svg"
import { useState } from "react"

export const Switch = ({ text }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
      <MsgSvg />
      <Text
        style={{
          width: '70%',
          color: '#6488d0',
          fontWeight: '700',
          fontSize: 15
        }}>
        {text}
      </Text>
    </View>
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
}

