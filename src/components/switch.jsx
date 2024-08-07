import { StyleSheet, Text, View } from "react-native"
import ToggleSwitch from "toggle-switch-react-native"
import { MsgSvg } from "../../assets/svg"
import { useEffect, useState } from "react"

export const Switch = ({ error, text, onSwitch, value = false }) => {
  const [isEnabled, setIsEnabled] = useState(value);
  const toggleSwitch = () => {
    { onSwitch && onSwitch() }
    if (!isEnabled)
      setIsEnabled(previousState => !previousState);
  }

  useEffect(() => {
    setIsEnabled(value)
  }, [value])

  return <View style={styles.block}>
    <View style={styles.continer}>
      <MsgSvg />
      <Text style={[styles.text, error && { color: 'red' }]}>{text}</Text>
    </View>
    <ToggleSwitch
      isOn={value}
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




const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  continer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  text: {
    width: '70%',
    color: '#6488d0',
    fontWeight: '700',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 15
  },
})