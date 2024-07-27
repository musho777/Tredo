import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store/configStore";
import { AddCount, AddSms, ChangeStatus } from "../store/action/action";
import PushNotification from 'react-native-push-notification';
import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase('Tredo.db', '1.0', '', 1)

const handleButtonClick = (message) => {
  PushNotification.localNotification({
    channelId: "sms-channel",
    title: message.originatingAddress,
    message: message.body,
  });
};

const getSmsAndUpdateStatus = (smsId) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM SMS WHERE sms_id = ?',
      [smsId],
      (tx, result) => {
        if (result.rows.length > 0) {
          const sms = result.rows.item(0);
          tx.executeSql(
            'UPDATE SMS SET status = ? WHERE sms_id = ?',
            [1, smsId],
            (tx, result) => {
              store.dispatch(ChangeStatus(smsId))
            },
            (tx, error) => {
              console.error('Failed to update SMS status:', error.message);
            }
          );
        } else {
          console.log('No SMS found with the provided ID');
        }
      },
      (tx, error) => {
        console.error('Failed to retrieve SMS:', error.message);
      }
    );
  });
};

const setSms = async (smsData, type = 'sms') => {

  const { body: message, originatingAddress: username, timestamp: sentAt } = smsData;
  let status = 0;

  db.transaction(tx => {
    // Check if the user exists
    tx.executeSql(
      'SELECT user_id FROM Users WHERE username = ?',
      [username],
      (tx, result) => {
        if (result.rows.length > 0) {
          const userId = result.rows.item(0).user_id;

          // Check if an SMS with the same sent_at timestamp and user_id exists
          tx.executeSql(
            'SELECT * FROM SMS WHERE user_id = ? AND sent_at = ?',
            [userId, sentAt],
            (tx, result) => {
              if (result.rows.length === 0) {
                // SMS does not exist, insert new record
                tx.executeSql(
                  'INSERT INTO SMS (user_id, message, status, sent_at) VALUES (?, ?, ?, ?)',
                  [userId, message, status, sentAt],
                  (tx, result) => {
                    const smsId = result.insertId;
                    sendMessage(smsData, smsId);
                    console.log('SMS inserted successfully');
                  },
                  (tx, error) => {
                    console.error('Failed to insert SMS:', error);
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
                      count: result.rows.item(0).message_count
                    }));
                  },
                  (tx, error) => {
                    console.error('Failed to get SMS count:', error);
                  }
                );
              } else {
                console.log('SMS with the same timestamp already exists');
              }
            },
            (tx, error) => {
              console.error('Failed to check for existing SMS:', error);
            }
          );
        } else {

          tx.executeSql(
            'INSERT INTO Users (username, type) VALUES (?, ?)',
            [username, type],
            (tx, result) => {
              const userId = result.insertId;
              tx.executeSql(
                'INSERT INTO SMS (user_id, message, sent_at) VALUES (?, ?, ?)',
                [userId, message, sentAt],
                (tx, result) => {
                  store.dispatch(AddCount());
                  store.dispatch(AddSms({
                    last_message: message,
                    username,
                    last_message_time: sentAt,
                    type
                  }));
                  console.log('SMS inserted successfully');
                },
                (tx, error) => {
                  console.error('Failed to insert SMS:', error);
                }
              );
            },
            (tx, error) => {
              console.error('Failed to insert user:', error);
            }
          );
        }
      },
      (tx, error) => {
        console.error('Failed to check if user exists:', error);
      }
    );
    handleButtonClick(smsData);
  });
};

export const sendMessage = async (message, id) => {
  console.log(message)
  let token = await AsyncStorage.getItem('token')
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      title: message.originatingAddress,
      unix: message.timestamp,
      message: message.body
    }),
    redirect: 'follow'
  };

  await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      if (result.status) {
        console.log(id)
        getSmsAndUpdateStatus(id)
      }
    })
    .catch(error => {
      console.log(error)
    });
}



export const dropAllTables = () => {
  db.transaction(tx => {
    // Drop tables if they exist
    tx.executeSql('DROP TABLE IF EXISTS SMS', [], (tx, result) => {
      console.log('SMS table dropped');
    }, (tx, error) => {
      console.error('Failed to drop SMS table:', error);
    });

    tx.executeSql('DROP TABLE IF EXISTS Users', [], (tx, result) => {
      console.log('Users table dropped');
    }, (tx, error) => {
      console.error('Failed to drop Users table:', error);
    });
  });
};

export const deleteAllData = () => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM Users', [], (tx, result) => {
      console.log('All users deleted');
    }, (tx, error) => {
      console.error('Failed to delete users:', error);
    });

    tx.executeSql('DELETE FROM SMS', [], (tx, result) => {
      console.log('All SMS deleted');
    }, (tx, error) => {
      console.error('Failed to delete SMS:', error);
    });
  });
};

export const headlessNotificationListener = async ({ notification }) => {
  if (notification) {
    const item = JSON.parse(notification)
    const message = {
      body: item.text,
      timestamp: item.time,
      originatingAddress: item.title,
      sortKey: item.sortKey
    };

    if (item.app != 'com.tredo') {
      handleButtonClick(message)
      setSms(message, 'notification')
    }
  }
}

