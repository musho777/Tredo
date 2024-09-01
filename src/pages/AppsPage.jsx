import { ActivityIndicator, AppState, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Header } from "../components/header";
import { useCallback, useEffect, useState } from "react";
import { InstalledApps } from 'react-native-launcher-kit';
import { Styles } from "../ui/style";
import { AppsItem } from "../components/appsItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { SearchInput } from "../components/SearchInput";


export const AppsPage = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [showModal, setShowModal] = useState(false)
  const [constatnApps, setConstantApps] = useState([])
  const [value, setValue] = useState()
  const CheckAllNotificationGetPermitiopn = async () => {
    if (isFocused) {
      const status = await RNAndroidNotificationListener.getPermissionStatus()
      if (status != 'authorized') {
        setShowModal(true)
      }
      else {
        setShowModal(false)
      }
    }
  }

  const getNotficiactionPermition = async () => {
    RNAndroidNotificationListener.requestPermission()
    const status = await RNAndroidNotificationListener.getPermissionStatus()
    if (status != 'authorized') {
      setShowModal(true)
      RNAndroidNotificationListener.requestPermission()
    }
    else {
      setShowModal(false)
    }
  }

  const [apps, setApps] = useState([]);
  const GetAllApp = async () => {
    // let item = InstalledApps.getApps();
    const item = InstalledApps.getApps().filter(elm =>
      elm.packageName != 'com.tredo' &&
      elm.packageName != 'com.google.android.apps.messaging' &&
      elm.packageName != 'com.android.messaging' &&
      elm.packageName != 'com.samsung.android.messaging' &&
      elm.packageName != 'com.android.mms' &&
      elm.packageName != 'com.huawei.message' &&
      elm.packageName != 'com.lge.message' &&
      elm.packageName != 'com.oneplus.mms' &&
      elm.packageName != 'com.miui.mms' &&
      elm.packageName != 'com.sonyericsson.conversations' &&
      elm.packageName != 'com.htc.sense.mms' &&
      elm.packageName != 'com.android.systemui'
    );
    setConstantApps(item)
    setApps(item)
  }
  useEffect(() => {
    GetAllApp()
  }, [])

  const [unSelected, setUnselected] = useState([])
  const GetUnselectedData = async () => {
    let notData = await AsyncStorage.getItem('notData')
    setUnselected(JSON.parse(notData))
  }

  useEffect(() => {
    let subscription;
    if (isFocused) {
      subscription = AppState.addEventListener('change', CheckAllNotificationGetPermitiopn);
    }
    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        CheckAllNotificationGetPermitiopn()
        GetUnselectedData()
      }
    }, [isFocused])
  );

  const Search = (e) => {
    let item = [...apps]
    setValue(e)
    let data = item.filter(elm => elm.label.toUpperCase().includes(e.toUpperCase()))
    if (e == '') {
      data = constatnApps
    }
    setApps(data)
  }


  return <View style={{ flex: 1 }}>
    <Header count={apps.length} title={'Приложения'} text={'Всего Приложений'} />
    {showModal && <View style={{ flex: 1, position: 'absolute', height: '100%', width: '100%', zIndex: 99999, justifyContent: 'center' }}>
      <View style={{ height: 400 }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Активировать чтение пуш-уведомлений</Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  getNotficiactionPermition()
                  setShowModal(false)
                }}>
                <Text style={styles.textStyle}>Перейти в настройки</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setShowModal(false)
                  navigation.navigate('connectionPage')

                }}>
                <Text style={styles.textStyle}>Вернуться в меню</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>}
    <SearchInput SearchMsg={(e) => Search(e)} value={value} />

    <ScrollView style={Styles.body}>

      <View style={{ gap: 20, paddingVertical: 20 }}>
        {constatnApps.length == 0 &&
          <ActivityIndicator size={'large'} color={'#236fe1'} />
        }
        {apps.length > 0 && apps.map((elm, i) => {
          if (
            elm.packageName != 'com.tredo' &&
            elm.packageName != 'com.google.android.apps.messaging' &&
            elm.packageName != 'com.android.messaging' &&
            elm.packageName != 'com.samsung.android.messaging' &&
            elm.packageName != 'com.android.mms' &&
            elm.packageName != 'com.huawei.message' &&
            elm.packageName != 'com.lge.message' &&
            elm.packageName != 'com.oneplus.mms' &&
            elm.packageName != 'com.miui.mms' &&
            elm.packageName != 'com.sonyericsson.conversations' &&
            elm.packageName != 'com.htc.sense.mms' &&
            elm.packageName != 'com.android.systemui'
          ) {
            return <AppsItem packageName={elm.packageName} value={unSelected.findIndex((el) => el == elm.packageName) >= 0} key={i} icon={elm.icon} label={elm.label} />
          }
        })}
      </View>
    </ScrollView>
  </View >
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 350,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 10,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    fontFamily: 'RobotoCondensed-Regular',
  },
});