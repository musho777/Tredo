import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Fragment, useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  PermissionsAndroid,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useDispatch } from 'react-redux';
import { SuccessIsOnline } from '../store/action/successAction';

const ScanScreen = ({ navigation }) => {
  const [permision, setPermision] = useState(true);
  const [r, setR] = useState(false)
  const dispatch = useDispatch()

  const onSuccess = async e => {
    const headers = {
      'Content-Type': 'application/json',
      'X-App-Client': 'MyReactNativeApp'
    };
    var requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };
    await fetch(`${e?.data}`, requestOptions)
      .then(response => response.json())
      .then(async result => {
        if (result.status) {
          await AsyncStorage.setItem('token', result?.token)
          await AsyncStorage.setItem('id', JSON.stringify(result.user.id))
          navigation.replace('permission')
          dispatch(SuccessIsOnline())
        }
      })
      .catch(error => {
      });
  };

  useEffect(() => {
    const per = async () => {
      let result = r
      if (!result) {
        const interval = setInterval(async () => {
          result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
          setR(result)
          if (result) {
            setPermision(true)
          }
          else {
            setPermision(false)
          }
        }, 1000);
        return () => clearInterval(interval);
      }
      else {
        result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
        setR(result)
        if (result) {
          setPermision(true)
        }
        else {
          setPermision(false)
        }
      }
    }
    per()
  }, [r])

  return (
    <View >
      <Fragment>
        <QRCodeScanner
          reactivate={true}
          showMarker={true}
          checkAndroid6Permissions
          ref={node => {
            scanner = node;
          }}
          onRead={onSuccess}
          bottomContent={
            permision ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack('')}
                  style={{
                    backgroundColor: '#313131',
                    width: 200,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                  }}>
                  <Text
                    style={{ color: '#FFFFFF', fontFamily: 'Lexend-SemiBold', fontSize: 15 }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              ''
            )
          }
        />
      </Fragment>
    </View>
  )
}
export default ScanScreen;