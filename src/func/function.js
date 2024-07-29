import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store/configStore";
import { AddCount, AddNewSms, AddSms, ChangeStatus, CheckOnline, Count, ReadSms, SmsSingPage } from "../store/action/action";
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

export const handleButtonClick = (message) => {
  PushNotification.localNotification({
    channelId: "sms-channel",
    title: message.originatingAddress,
    message: message.body,
  });
};
export const handleSirenaNotification = (message) => {
  PushNotification.localNotification({
    channelId: "sms-channel",
    title: "iron",
    message: message,
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
export const setSms = async (smsData, type = 'sms') => {
  console.log(1)
  const { body: message, originatingAddress: username, timestamp: sentAt } = smsData;
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
                tx.executeSql(
                  'INSERT INTO SMS (user_id, message, status, sent_at, username) VALUES (?, ?, ?, ?, ?)',
                  [userId, message, status, sentAt, username],
                  async (tx, result) => {
                    const smsId = result.insertId;
                    await sendMessage(smsData, smsId, userId);
                  },
                  (tx, error) => {
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
                    console.log('Failed to get SMS count:', error);
                  }
                );
              }
            },
            (tx, error) => {
              // console.log('Failed to check for existing SMS:', error);
            }
          );
        } else {
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
                  await sendMessage(smsData, smsId, userId);
                  store.dispatch(AddCount());
                  store.dispatch(AddSms({
                    last_message: message,
                    username,
                    last_message_time: sentAt,
                    type,
                    user_id: userId
                  }));
                },
                (tx, error) => {
                  console.log('Failed to insert SMS:', error);
                }
              );
            },
            (tx, error) => {
              console.log('Failed to insert user:', error);
            }
          );
        }
      },
      (tx, error) => {
        console.log('Failed to check if user exists:', error);
      }
    );
    handleButtonClick(smsData);
  });
};

export const sendMessage = async (message, id, userId, rev = true) => {
  let confirm = 2
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

  store.dispatch(ChangeStatus(id, 2))
  await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.status) {
        confirm = 1
        getSmsAndUpdateStatus(id, 1)
        store.dispatch(ChangeStatus(id, 1))
      }
    })
    .catch(error => {
      getSmsAndUpdateStatus(id, 0)
      store.dispatch(ChangeStatus(id, 0))
      confirm = 0
    });
  // body: message, originatingAddress: username, timestamp: sentAt
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



export const GetAllDontSendSms = () => {
  let dontSendmessages = [];
  if (dontSendmessages.length == 0) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Sms WHERE status = ?',
        [0],
        async (tx, result) => {
          for (let i = 0; i < result.rows.length; i++) {
            dontSendmessages.push(result.rows.item(i));
          }
          tx.executeSql(
            'UPDATE Sms SET status = ? WHERE status = ?',
            [2, 0],
            (tx, result) => {
              // console.log('Update successful:', result);
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
            await sendMessage(temp, elm.sms_id, elm.user_id, false)
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



// export const dropAllTables = () => {
//   db.transaction(tx => {
//     // Drop tables if they exist
//     tx.executeSql('DROP TABLE IF EXISTS SMS', [], (tx, result) => {
//       console.log('SMS table dropped');
//     }, (tx, error) => {
//       console.log('Failed to drop SMS table:', error);
//     });

//     tx.executeSql('DROP TABLE IF EXISTS Users', [], (tx, result) => {
//       console.log('Users table dropped');
//     }, (tx, error) => {
//       console.log('Failed to drop Users table:', error);
//     });
//   });
// };

// export const deleteAllData = () => {
//   db.transaction(tx => {
//     tx.executeSql('DELETE FROM Users', [], (tx, result) => {
//       console.log('All users deleted');
//     }, (tx, error) => {
//       console.log('Failed to delete users:', error);
//     });

//     tx.executeSql('DELETE FROM SMS', [], (tx, result) => {
//       console.log('All SMS deleted');
//     }, (tx, error) => {
//       console.log('Failed to delete SMS:', error);
//     });
//   });
// };

export const headlessNotificationListener = async ({ notification }) => {
  if (notification) {
    const item = JSON.parse(notification)
    const message = {
      body: item.text,
      timestamp: JSON.parse(item.time),
      originatingAddress: item.title,
      sortKey: item.sortKey
    };

    if (item.app != 'com.tredo') {
      setSms(message, 'notification')
    }
  }
}

export const isOnline = async () => {
  let token = await AsyncStorage.getItem('token')
  store.dispatch(CheckOnline(token))
}

