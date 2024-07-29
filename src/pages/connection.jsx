import { TouchableOpacity, View, Text, PermissionsAndroid, StyleSheet, Vibration, } from "react-native"
import { LogOut } from "../../assets/svg"
import { AppInfo } from "../components/appInfo"
import { Styles } from "../ui/style"
import { useEffect, useRef, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch, useSelector } from "react-redux"
import { ClearLoginAction, LogoutAction } from "../store/action/action"
import { DefaultSmsButton } from "../components/defaultSmsButton"
import { Ping } from "../components/ping"
import { HomeButtonWrapper } from "../components/homeButtonWrapper"
import { Status_Bar } from "../components/statusBar"
import { dropAllTables, handleButtonClick, handleSirenaNotification } from "../func/function"
import Pusher from 'pusher-js/react-native';
import Sound from 'react-native-sound';

import { ModalComponent } from "../components/Modal"



export const Connection = ({ navigation }) => {
  const soundRef = useRef(null);
  // const music = new Sound('sirena.mp3', Sound.MAIN_BUNDLE, (error) => {
  //   if (error) {
  //   }
  // });
  const dispatch = useDispatch()
  const [token, setToken] = useState()
  const [refresh, setRefresh] = useState(false)
  // const [id, setId] = useState()
  const [popUp, setPopUp] = useState(false)
  const [message, setMessage] = useState()



  const handlePlaySound = () => {
    console.log("00")
    if (soundRef.current) {
      soundRef.current.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
          // Restart the sound when it ends
          soundRef.current.setCurrentTime(0); // Reset to the beginning
          handlePlaySound(); // Play again
        } else {
          console.log('Playback failed due to audio decoding errors');
          soundRef.current.reset();
        }
      });
    } else {
      // Load the sound file
      const sound = new Sound('sirena.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }

        // Play the sound
        sound.play((success) => {
          if (success) {
            console.log('Successfully finished playing');
            // Restart the sound when it ends
            sound.setCurrentTime(0); // Reset to the beginning
            handlePlaySound(); // Play again
          } else {
            console.log('Playback failed due to audio decoding errors');
            sound.reset();
          }
        });
      });

      // Store the sound object in a ref
      soundRef.current = sound;
    }
  };


  const handleStopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        console.log('Sound stopped');
      });
    }
    // setIsPlaying(false);
  };


  // useEffect(() => {
  //   handlePlaySound()
  // }, [])

  const func = async () => {
    await AsyncStorage.setItem('restart', 'true')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefresh(false)
    }, 1000);
    return () => clearTimeout(timer);
  }, [refresh]);


  const getToken = async () => {
    setToken(await AsyncStorage.getItem('token'))
    // setId(await AsyncStorage.getItem('id'))
  }


  const GoNextPage = async () => {
    try {
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      if (!g2 || !g4 || !g5) {
        await AsyncStorage.setItem('permition', 'no')
        if (defaultSms) {
          navigation.navigate("permission")
        }
      }
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      func()
    }, 2000);
    GoNextPage()
    getToken()
    return () => clearTimeout(timer);
  }, []);


  const Logout = async () => {
    dispatch(LogoutAction(token))
    dispatch(ClearLoginAction())
    await AsyncStorage.clear()
    navigation.replace('home')
  }





  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher('local', {
      cluster: 'mt1',
      wsHost: 'iron-pay.com',
      wsPort: 6001,
      wssPort: 6001,
      forceTLS: true,
      encrypted: true,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    });

    const cardBlockedChannel = pusher.subscribe('card_blocked');

    cardBlockedChannel.bind('card_blocked', async function (data) {
      // console.log('Card blocked event data:', data);
      let id = await AsyncStorage.getItem('id')
      console.log(id, data.message.user_id, '222')
      setMessage(data.message.app_message)
      if (id == data.message.user_id) {
        console.log("Mushoooo")
        await AsyncStorage.setItem('showPopUp', "1")
        setPopUp(true)
        handleSirenaNotification(data.message.app_message)
        handlePlaySound()
        Vibration.vibrate();
      }
    });

    return () => {
      // pusher.unsubscribe('card_blocked');
    };
  }, []);

  const ShowPopUp = async () => {
    let show = await AsyncStorage.getItem('showPopUp')
    if (show == 1) {
      setPopUp(true)
    }
    else {
      setPopUp(false)
    }
  }

  useEffect(() => {
    ShowPopUp()
  }, [])

  const ModalAssept = async () => {
    await AsyncStorage.setItem('showPopUp', "0")
    handleStopSound()
    Vibration.cancel();
    setPopUp(false)
  }

  return <View style={[Styles.home, { paddingHorizontal: 20 }]}>
    <ModalComponent modalVisible={popUp} accept={() => ModalAssept()} message={message} popUp={popUp} />
    <Status_Bar />
    <AppInfo version={false} light />
    {/* <TouchableOpacity onPress={() => Logout()} style={styles.logout}>
      <LogOut />
    </TouchableOpacity> */}
    <View>
      <Ping refresh={refresh} />
      <HomeButtonWrapper setRefresh={(e) => setRefresh(e)} />
      <DefaultSmsButton />
      <Text style={styles.text4}>Не закрывайте приложение, оставьте его в фоновом режиме</Text>
    </View>
  </View>
}

const styles = StyleSheet.create({
  logout: {
    position: "absolute",
    top: 30,
    left: 15
  },
  text4: {
    textAlign: 'center',
    marginTop: 25,
    color: "#7091d3",
    fontFamily: 'RobotoCondensed-Regular',
  }
})