import { StatusBar, TouchableOpacity, View, Image, Text } from "react-native"
import { KeySvg, MessageSvg, NotificationSvg, RefreshSvg, SettingIcon } from "../../assets/svg"
import { AppInfo } from "../components/appInfo"
import { Styles } from "../ui/style"
import { Button } from "../components/button"
import { Button3 } from "../components/button3"

export const Connection = () => {
  return <View style={[Styles.home, { paddingHorizontal: 20 }]}>
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor='#f9f9f9' />
    <TouchableOpacity style={{ position: 'absolute', top: 25, left: 15 }}>
      <SettingIcon />
    </TouchableOpacity>
    <AppInfo version={false} light />
    <View>
      <View>
        <View style={{ alignItems: 'center' }}>
          <Image style={{ width: 100, height: 100 }} source={require('../../assets/image/radio.png')} />
          <View style={{ marginTop: 20, alignItems: 'center', gap: 7 }}>
            <Text style={{ color: '#2f508e', fontSize: 20, fontWeight: '500' }}>Устройство подключено</Text>
            <Text style={{ color: '#5e86cf', fontSize: 14 }}>Пинг: 1112 мс</Text>
            <Text style={{ color: '#5e86cf', fontSize: 14 }}>Версия: Release 1.8.7</Text>
          </View>
        </View>
        <View style={{ gap: 10, marginTop: 100 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button3 svg={<MessageSvg />} text={"Сообщения"} width={"49%"} />
            <Button3 svg={<NotificationSvg />} text={"Уведомления"} width={"49%"} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button3 svg={<RefreshSvg />} text={"Обновления"} width={"49%"} bg={"#e8f1ff"} />
            <Button3 svg={<KeySvg />} text={"Разрешения"} width={"49%"} bg={"#e8f1ff"} />
          </View>
        </View>
        <Text style={{ textAlign: 'center', marginTop: 25, color: "#7091d3", fontWeight: '500' }}>Не закрывайте приложение, оставьте его в фоновом режиме</Text>
      </View>
    </View>
  </View>
}