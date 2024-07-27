import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { MsgBody } from "../components/msgBody";
import { useDispatch, useSelector } from "react-redux";
import { ClearAllSms, ClearSendSms, ReadSms } from "../store/action/action";
import SQLite from 'react-native-sqlite-2';


export const Notification = ({ navigation }) => {

  const db = SQLite.openDatabase('Tredo.db', '1.0', '', 1)


  const [sms, setSms] = useState([])
  const readSms = useSelector((st) => st.readSms)
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)

  const getTotalUserCount = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) AS user_count FROM Users',
        [],
        (tx, result) => {
          const userCount = result.rows.item(0).user_count;
          // setCount(userCount)
          dispatch(Count(userCount))
        },
        (tx, error) => {
          console.error('Failed to get user count:', error.message);
          return 0
        }
      );
    });
  };



  const getPaginatedUsers = (type, page = 1, pageSize = 10) => {
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
          dispatch(ReadSms(users)); // Assuming dispatch is defined elsewhere in your code
        },
        (tx, error) => {
          console.error('Failed to get users with last message, timestamp, and SMS count:', error.message);
        }
      );
    });

  };

  useEffect(() => {
    getTotalUserCount()
  }, [])

  useEffect(() => {
    getPaginatedUsers('notification', page)
  }, [page])


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // dispatch(ClearSendSms())
      getPaginatedUsers('notification', 1)
      dispatch(ClearAllSms())
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setSms(readSms.data)
  }, [readSms.data])


  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Все Уведомления</Text>
      <View style={styles.smsCount}>
        <Text style={styles.AllSms1}>Всего Уведомления:</Text>
        <Text style={styles.AllSms1}>{sms?.length}</Text>
      </View>
    </View>
    <ScrollView style={styles.body} >
      {sms.map((elm, i) => {
        return <MsgBody type='notification' last={i == readSms?.data?.length - 1} data={elm} key={i} />
      })}
    </ScrollView>
  </View>
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgb(249,249,249)',
    height: '15%',
    width: '100%',
    justifyContent: 'flex-end',
    gap: 5,
    paddingBottom: 15,
    paddingHorizontal: 30,
  },
  body: {
    backgroundColor: "#eef4ff",
    height: "90%",
    paddingHorizontal: 30,
  },
  AllSms: {
    color: '#236fe1',
    fontSize: 20,
    fontFamily: 'RobotoCondensed-Medium',
  },
  AllSms1: {
    color: '#6e90d4',
    fontSize: 16,
    fontFamily: 'RobotoCondensed-Medium',
  },
  smsCount: {
    flexDirection: 'row'
  }
});
