import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store/configStore";
import { AddCount, AddSms, ChangeStatus, CheckOnline, Count, ReadSms, SmsSingPage } from "../store/action/action";
import PushNotification from 'react-native-push-notification';
import SQLite from 'react-native-sqlite-2';

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

const handleButtonClick = (message) => {
  PushNotification.localNotification({
    channelId: "sms-channel",
    title: message.originatingAddress,
    message: message.body,
  });
};

// const getSmsAndUpdateStatus = (smsId) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM SMS WHERE sms_id = ?',
//       [smsId],
//       (tx, result) => {
//         if (result.rows.length > 0) {
//           tx.executeSql(
//             'UPDATE SMS SET status = ? WHERE sms_id = ?',
//             [1, smsId],
//             (tx, result) => {
//               console.log("Status Updated", result)
//               store.dispatch(ChangeStatus(smsId))
//             },
//             (tx, error) => {
//               console.error('Failed to update SMS status:', error.message);
//             }
//           );
//         } else {
//           console.log('No SMS found with the provided ID');
//         }
//       },
//       (tx, error) => {
//         console.error('Failed to retrieve SMS:', error.message);
//       }
//     );
//   });
// };

const getSmsAndUpdateStatus = (smsId) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE SMS SET status = ? WHERE sms_id = ?',
      [1, smsId],
      (tx, result) => {
        console.log('Affected rows:', result.rowsAffected); // Log the number of affected rows
      },
      (tx, error) => {
        console.error('Failed to update SMS status:', error.message);
      }
    );
  });
};
export const setSms = async (smsData, type = 'sms') => {

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
          tx.executeSql(
            'SELECT * FROM SMS WHERE user_id = ? AND sent_at = ?',
            [userId, sentAt],
            (tx, result) => {
              if (result.rows.length === 0) {
                tx.executeSql(
                  'INSERT INTO SMS (user_id, message, status, sent_at) VALUES (?, ?, ?, ?)',
                  [userId, message, status, sentAt],
                  async (tx, result) => {
                    const smsId = result.insertId;
                    await sendMessage(smsData, smsId);
                    // console.log('SMS inserted successfully');
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
                      count: result.rows.item(0).message_count,
                      user_id: userId
                    }));
                  },
                  (tx, error) => {
                    console.error('Failed to get SMS count:', error);
                  }
                );
              }
            },
            (tx, error) => {
              // console.error('Failed to check for existing SMS:', error);
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
      if (result.status) {
        getSmsAndUpdateStatus(id)
        store.dispatch(ChangeStatus(id))
      }
    })
    .catch(error => {
    });
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
        console.log(users)
        store.dispatch(ReadSms(users));
      },
      (tx, error) => {
        console.error('Failed to get users with last message, timestamp, and SMS count:', error.message);
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
        console.error('Failed to get SMS user count:', error.message);
      }
    );
  });
};

export const getSmsByUserId = (page = 1, pageSize = 10, userId) => {
  const offset = (page - 1) * pageSize;
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM SMS WHERE user_id = ? ORDER BY sent_at DESC LIMIT ? OFFSET ?',
      [userId, pageSize, offset],
      (tx, result) => {
        const messages = [];
        for (let i = 0; i < result.rows.length; i++) {
          messages.push(result.rows.item(i));
        }
        store.dispatch(SmsSingPage(messages))
      },
      (tx, error) => {
        console.error('Failed to get messages:', error.message);
      }
    );
  });
};


// export const dropAllTables = () => {
//   db.transaction(tx => {
//     // Drop tables if they exist
//     tx.executeSql('DROP TABLE IF EXISTS SMS', [], (tx, result) => {
//       console.log('SMS table dropped');
//     }, (tx, error) => {
//       console.error('Failed to drop SMS table:', error);
//     });

//     tx.executeSql('DROP TABLE IF EXISTS Users', [], (tx, result) => {
//       console.log('Users table dropped');
//     }, (tx, error) => {
//       console.error('Failed to drop Users table:', error);
//     });
//   });
// };

// export const deleteAllData = () => {
//   db.transaction(tx => {
//     tx.executeSql('DELETE FROM Users', [], (tx, result) => {
//       console.log('All users deleted');
//     }, (tx, error) => {
//       console.error('Failed to delete users:', error);
//     });

//     tx.executeSql('DELETE FROM SMS', [], (tx, result) => {
//       console.log('All SMS deleted');
//     }, (tx, error) => {
//       console.error('Failed to delete SMS:', error);
//     });
//   });
// };

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

export const isOnline = async () => {
  let token = await AsyncStorage.getItem('token')
  store.dispatch(CheckOnline(token))
}

