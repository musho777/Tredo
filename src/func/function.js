import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store/configStore";
import { AddCount, AddNewSms, AddSms, ChangeStatus, CheckOnline, Count, DeviceInfoAction, ReadSms, SmsSingPage } from "../store/action/action";
import PushNotification from 'react-native-push-notification';
import SQLite from 'react-native-sqlite-2';
import { InstalledApps } from "react-native-launcher-kit";
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { PermissionsAndroid } from "react-native";
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import NetInfo from '@react-native-community/netinfo';
import { RequestDisableOptimization, BatteryOptEnabled } from "react-native-battery-optimization-check";
import SmsRetriever from 'react-native-sms-retriever';

import RNSimData from 'react-native-sim-data'

import { NativeModules } from 'react-native';

const { SmsListenerModule } = NativeModules;

const db = SQLite.openDatabase('Tredo.db', '1.0', '', 1)



export const createTables = () => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS Users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type TEXT NOT NULL DEFAULT sms
      )`,
      [],
      (sqlTxn, res) => {
      },
      error => {
      },
    );

    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS SMS (
        sms_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT,
        message TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
      )`,
      [],
      (sqlTxn, res) => {
      },
      error => {
      },
    );
  });
};

const handleButtonClick = (message, type) => {
  if (type == 'sms') {
    PushNotification.localNotification({
      channelId: "sms-channel",
      title: message.originatingAddress,
      message: message.body,
    });
  }
  else {
    PushNotification.localNotification({
      channelId: "sms-channel",
      title: message.title,
      message: message.body,
    });
  }
};



export const handleSirenaNotification = (message) => {
  PushNotification.localNotification({
    channelId: "s-channel",
    title: "iron",
    message: message,
    soundName: 'sirena.mp3',
  });
};



const getSmsAndUpdateStatus = (smsId, id = 1) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE SMS SET status = ? WHERE sms_id = ?',
      [id, smsId],
      (tx, result) => {
      },
      (tx, error) => {
      }
    );
  });
};
// export const setSms = async (smsData, type = 'sms') => {
//   const { body: message, originatingAddress: username, timestamp: sentAt, title: title } = smsData;
//   let status = 0;

//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT user_id FROM Users WHERE username = ?',
//       [username],
//       (tx, result) => {
//         if (result.rows.length > 0) {
//           const userId = result.rows.item(0).user_id;
//           tx.executeSql(
//             'SELECT * FROM SMS WHERE user_id = ? AND sent_at = ?',
//             [userId, sentAt],
//             (tx, result) => {
//               if (result.rows.length === 0) {
//                 tx.executeSql(
//                   'INSERT INTO SMS (user_id, message, status, sent_at, username) VALUES (?, ?, ?, ?, ?)',
//                   [userId, message, status, sentAt, username],
//                   async (tx, result) => {
//                     const smsId = result.insertId;
//                     await sendMessage(smsData, smsId, userId, true, type, title);
//                   },
//                   (tx, error) => {
//                   }
//                 );

//                 // Update message count for the user
//                 tx.executeSql(
//                   'SELECT COUNT(*) AS message_count FROM SMS WHERE user_id = ?',
//                   [userId],
//                   (tx, result) => {
//                     store.dispatch(AddSms({
//                       last_message: message,
//                       username,
//                       last_message_time: sentAt,
//                       count: result.rows.item(0).message_count,
//                       user_id: userId,
//                       type,
//                     }));
//                   },
//                   (tx, error) => {
//                   }
//                 );
//               }
//             },
//             (tx, error) => {
//             }
//           );
//         } else {
//           tx.executeSql(
//             'INSERT INTO Users (username, type) VALUES (?, ?)',
//             [username, type],
//             (tx, result) => {
//               const userId = result.insertId;
//               tx.executeSql(
//                 'INSERT INTO SMS (user_id, message, sent_at, username) VALUES (?, ?, ?, ?)',
//                 [userId, message, sentAt, username],
//                 async (tx, result) => {
//                   const smsId = result.insertId;
//                   await sendMessage(smsData, smsId, userId, true, type, title);
//                   store.dispatch(AddCount());
//                   store.dispatch(AddSms({
//                     last_message: message,
//                     username,
//                     last_message_time: sentAt,
//                     type,
//                     user_id: userId,
//                     count: 1
//                   }));
//                 },
//                 (tx, error) => {
//                 }
//               );
//             },
//             (tx, error) => {
//             }
//           );
//         }
//       },
//       (tx, error) => {
//       }
//     );
//     handleButtonClick(smsData, type);
//   });
// };


export const setSms = async (smsData, type = 'sms') => {
  const { body: message, originatingAddress: username, timestamp: sentAt, title: title } = smsData;
  let status = 0;
  db.transaction(tx => {
    tx.executeSql(
      'SELECT user_id FROM Users WHERE username = ?',
      [username],
      (tx, result) => {
        if (result.rows.length > 0) {
          const userId = result.rows.item(0).user_id;
          tx.executeSql(
            'SELECT * FROM SMS WHERE user_id = ? AND sent_at = ?',
            [userId, sentAt],
            (tx, result) => {
              if (result.rows.length === 0) {
                handleButtonClick(smsData, type);
                // Insert the new SMS message as it doesn't exist in the database
                tx.executeSql(
                  'INSERT INTO SMS (user_id, message, status, sent_at, username) VALUES (?, ?, ?, ?, ?)',
                  [userId, message, status, sentAt, username],
                  async (tx, result) => {
                    const smsId = result.insertId;
                    await sendMessage(smsData, smsId, userId, true, type, title);
                  },
                  (tx, error) => {
                    console.log('Error inserting SMS:', error);
                  }
                );

                // Update message count for the user
                tx.executeSql(
                  'SELECT COUNT(*) AS message_count FROM SMS WHERE user_id = ?',
                  [userId],
                  (tx, result) => {
                    store.dispatch(AddSms({
                      last_message: message,
                      username,
                      last_message_time: sentAt,
                      count: result.rows.item(0).message_count,
                      user_id: userId,
                      type,
                    }));
                  },
                  (tx, error) => {
                    console.log('Error fetching message count:', error);
                  }
                );
              } else {
                // Message already exists, log the message
                // console.log('Message already exists:', message);
              }
            },
            (tx, error) => {
              console.log('Error checking if SMS exists:', error);
            }
          );
        } else {
          // User does not exist, create a new user and insert SMS
          tx.executeSql(
            'INSERT INTO Users (username, type) VALUES (?, ?)',
            [username, type],
            (tx, result) => {
              const userId = result.insertId;
              tx.executeSql(
                'INSERT INTO SMS (user_id, message, sent_at, username) VALUES (?, ?, ?, ?)',
                [userId, message, sentAt, username],
                async (tx, result) => {
                  const smsId = result.insertId;
                  await sendMessage(smsData, smsId, userId, true, type, title);
                  store.dispatch(AddCount());
                  store.dispatch(AddSms({
                    last_message: message,
                    username,
                    last_message_time: sentAt,
                    type,
                    user_id: userId,
                    count: 1
                  }));
                },
                (tx, error) => {
                  console.log('Error inserting SMS for new user:', error);
                }
              );
            },
            (tx, error) => {
              console.log('Error inserting new user:', error);
            }
          );
        }
      },
      (tx, error) => {
        console.log('Error selecting user:', error);
      }
    );
    // if (messagedosenotexist) {
    //   handleButtonClick(smsData, type);
    // }
  });
};




export const sendMessage = async (message, id, userId, rev = true, type, title) => {
  let confirm = 2
  let token = await AsyncStorage.getItem('token')
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);
  let tit
  if (title) {
    tit = title
  }
  else {
    tit = ""
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      title: message.originatingAddress,
      unix: message.timestamp,
      message: type == 'sms' ? message.body : `${tit}——${message.body}`,
      type: type == 'sms' ? 'message' : 'push'
    }),
    redirect: 'follow'
  };

  store.dispatch(ChangeStatus(id, 2))
  await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.status) {
        confirm = 1
        getSmsAndUpdateStatus(id, 1)
        store.dispatch(ChangeStatus(id, 1))
      }
      else {
        getSmsAndUpdateStatus(id, 0)
        store.dispatch(ChangeStatus(id, 0))
      }
    })
    .catch(error => {
      getSmsAndUpdateStatus(id, 0)
      store.dispatch(ChangeStatus(id, 0))
      confirm = 0
    });
  if (rev) {
    let data = {
      message: message.body,
      username: message.originatingAddress,
      sent_at: message.timestamp,
      status: confirm,
      user_id: userId,
      sms_id: id
    }
    store.dispatch(AddNewSms(data))
  }
}


export const getPaginatedUsers = async (type, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  db.transaction(tx => {
    tx.executeSql(
      `SELECT Users.user_id, 
              Users.username, 
              SMS.message AS last_message, 
              SMS.sent_at AS last_message_time,
              (SELECT COUNT(*) FROM SMS WHERE SMS.user_id = Users.user_id) AS sms_count
       FROM Users
       INNER JOIN SMS ON Users.user_id = SMS.user_id
       WHERE Users.type = ?
         AND SMS.sent_at = (
           SELECT MAX(sent_at)
           FROM SMS
           WHERE SMS.user_id = Users.user_id
         )
       GROUP BY Users.user_id, Users.username, SMS.message, SMS.sent_at
       ORDER BY SMS.sent_at DESC
       LIMIT ? OFFSET ?`,
      [type, pageSize, offset],
      (tx, result) => {
        const users = [];
        for (let i = 0; i < result.rows.length; i++) {
          users.push(result.rows.item(i));
        }
        store.dispatch(ReadSms(users));
      },
      (tx, error) => {
      }
    );
  });

};

export const getTotalSmsUserCount = (type) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) AS user_count FROM Users WHERE type = ?',
      [type],
      (tx, result) => {
        const userCount = result.rows.item(0).user_count;
        store.dispatch(Count(userCount));
      },
      (tx, error) => {
      }
    );
  });
};

export const getSmsByUserId = (page = 1, pageSize = 10, userId, searchTerm = '') => {
  const offset = (page - 1) * pageSize;
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM SMS WHERE user_id = ? AND message LIKE ? ORDER BY sent_at DESC LIMIT ? OFFSET ?',
      [userId, `%${searchTerm}%`, pageSize, offset],
      (tx, result) => {
        const messages = [];
        for (let i = 0; i < result.rows.length; i++) {
          messages.push(result.rows.item(i));
        }
        store.dispatch(SmsSingPage(messages));
      },
      (tx, error) => {
      }
    );
  });
};



let dontSendmessages = [];
export const GetAllDontSendSms = () => {
  if (dontSendmessages.length == 0) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT Sms.*, Users.type FROM Sms INNER JOIN Users ON Sms.user_id = Users.user_id WHERE Sms.status = ?',
        [0],
        async (tx, result) => {
          for (let i = 0; i < result.rows.length; i++) {
            dontSendmessages.push(result.rows.item(i));
          }
          tx.executeSql(
            'UPDATE Sms SET status = ? WHERE status = ?',
            [2, 0],
            (tx, result) => {
            },
            (tx, error) => {
            }
          );
          for (let i = 0; i < dontSendmessages.length; i++) {
            const elm = dontSendmessages[i];
            const temp = {
              originatingAddress: elm.username,
              timestamp: elm.sent_at,
              body: elm.message
            }
            await sendMessage(temp, elm.sms_id, elm.user_id, false, elm.type)
            dontSendmessages.splice(i, 1);
            i--;
          }
        },
        (tx, error) => {
        }
      );
    });
  }
}


let lastEventTimestamp = 0;
const DEBOUNCE_INTERVAL = 500;
export const headlessNotificationListener = async ({ notification }) => {
  let token = await AsyncStorage.getItem('token')
  const currentTimestamp = Date.now();
  if (currentTimestamp - lastEventTimestamp <= DEBOUNCE_INTERVAL) {
    return;
  }
  lastEventTimestamp = currentTimestamp;

  if (notification && token) {
    const item = JSON.parse(notification)
    let message = {
      body: item.text,
      timestamp: JSON.parse(item.time),
      originatingAddress: item.app,
      title: item.title
    };


    let notData = await AsyncStorage.getItem('notData')
    let data = JSON.parse(notData)
    if (data.findIndex((elm) => elm == item.app) >= 0) {
      setSms(message, 'notification')
    }
  }
}

export const isOnline = async () => {
  let token = await AsyncStorage.getItem('token')
  store.dispatch(CheckOnline(token))
}



const GetAllApp = async () => {
  let notData = await AsyncStorage.getItem('notData')
  let app = JSON.parse(notData)
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
  let data = []
  item.map((elm, i) => {
    let status = 0
    if (app.findIndex((el) => el == elm.packageName) >= 0) {
      status = 1
    }
    data.push({ name: elm.packageName, value: 1, label: elm.label })
  })
  return data
}

// const ChackBattaryOptimzation = async () => {
//   await BatteryOptEnabled().then(async (isEnabled) => {
//     console.log(isEnabled)
//     return isEnabled
//   });
// }

const CheckPermition = async () => {
  const status = await RNAndroidNotificationListener.getPermissionStatus()
  const read_sms = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
  const read_contacts = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
  const read_phonCall = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
  const postnotification = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  let battary = false

  await BatteryOptEnabled().then(async (isEnabled) => {
    battary = !isEnabled
  });

  let read_notification = false
  if (status == 'authorized') {
    read_notification = true
  }
  else {
    read_notification = false
  }
  return {
    read_notification: read_notification,
    read_sms: read_sms,
    read_contacts: read_contacts,
    read_phonCall: read_phonCall,
    postnotification: postnotification,
    battaryOptimziation: battary
  }
}

const fetchPingTime = async () => {
  const startTime = Date.now();
  try {
    await fetch('https://www.google.com', { method: 'HEAD' });
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    return timeTaken
    // setPingTime(timeTaken);
  } catch (error) { }
};

const measureUploadSpeed = async () => {
  const startTime = Date.now();
  try {
    const response = await fetch('https://iron-pay.com/uploads/invoce/1728372244.jpg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      // body: file,
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    const speed = (1024 * 1024 / duration) / 1024 / 1024;
    return speed.toFixed(2)
  } catch (error) {
    console.error('Upload failed', error);
  }
};



const SetDeviceData = async () => {
  const app_configs = await GetAllApp()
  const push_id = await messaging().getToken();
  const id = await DeviceInfo.getUniqueId();
  const level = await DeviceInfo.getBatteryLevel();
  const configs = await CheckPermition()
  const state = await NetInfo.fetch();
  const connectionType = state.type;
  let token = await AsyncStorage.getItem('token')
  const carrierName = await DeviceInfo.getCarrier();
  let internet = 'wifi'
  if (connectionType === 'wifi') {
    internet = 'Wi-Fi'
  } else if (connectionType === 'cellular') {
    internet = 'Mobile'
  } else {
    internet = connectionType
  }
  store.dispatch(DeviceInfoAction(token,
    {
      internet: internet,
      operator: carrierName,
      internet_speed: await fetchPingTime(),
      internet_signal: await measureUploadSpeed(),
      push_id: push_id,
      android: DeviceInfo.getSystemVersion(),
      name: DeviceInfo.getBrand(),
      surname: DeviceInfo.getModel(),
      phone_id: id,
      battery: Math.round(level * 100),
      configs: configs,
      app_configs: app_configs,
      version: 1.5
    }
  ))
}


export const SetDeviceInfo = async () => {
  SetDeviceData()
  isOnline()
  GetAllDontSendSms()
  GetAllSms()
  // onPhoneNumberPressed()
  // GetAllNotificaton()
}





export const GetAllSms = () => {
  SmsListenerModule.getAllSMS()
    .then(smsList => {
      smsList?.map((elm, i) => {
        setSms(elm, 'sms')
      })
    })
    .catch(error => {
      console.error('Failed to get SMS messages:', error);
    });
}

// const onPhoneNumberPressed = async () => {
//   SmsListenerModule.getPhoneNumber()
//     .then(smsList => {
//       console.log(smsList, 'smsList')
//     })
//     .catch(error => {
//       console.error('Failed to get SMS messages:', error);
//     });
// };



export const GetLastSms = () => {
  SmsListenerModule.getLast()
    .then(smsList => {
      console.log(smsList)
      setSms(smsList, 'sms')
    })
    .catch(error => {
      console.error('Failed to get SMS messages:', error);
    });
}

// export const GetAllNotificaton = () => {
//   console.log("01`")
//   SmsListenerModule.getAllActiveNotifications()
//     .then((notifications) => {
//       console.log(notifications, 'notifications')
//       notifications?.map((elm, i) => {
//         console.log('notifications', elm)
//         // headlessNotificationListener(elm)
//       })
//       console.log(notifications);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }