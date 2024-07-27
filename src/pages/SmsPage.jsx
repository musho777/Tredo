import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native"
import { MsgBody } from "../components/msgBody";
import { useDispatch, useSelector } from "react-redux";
import { Count, ReadSms } from "../store/action/action";
import SQLite from 'react-native-sqlite-2';

export const SmsPage = () => {

  const [sms, setSms] = useState([])
  const readSms = useSelector((st) => st.readSms)
  const dispatch = useDispatch()
  const db = SQLite.openDatabase('Tredo.db', '1.0', '', 1)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)



  const getTotalUserCount = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) AS user_count FROM Users',
        [],
        (tx, result) => {
          const userCount = result.rows.item(0).user_count;
          setCount(userCount)
          dispatch(Count(userCount))
        },
        (tx, error) => {
          console.error('Failed to get user count:', error.message);
          return 0
        }
      );
    });
  };



  const getPaginatedUsers = (page = 1, pageSize = 10) => {
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
        ["sms", pageSize, offset],
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
    getPaginatedUsers(page)
  }, [page])

  useEffect(() => {
    setSms(readSms.data)
  }, [readSms.data])



  const renderItem = ({ item, index }) => {
    return <MsgBody last={index == sms.length - 1} data={item} key={index} />
  }

  return <View>
    <View style={styles.header}>
      <Text style={styles.AllSms}>Все сообщения</Text>
      <View style={styles.smsCount}>
        <Text style={styles.AllSms1}>Всего сообщений:</Text>
        <Text style={styles.AllSms1}>{readSms.count}</Text>
      </View>
    </View>
    <FlatList
      data={sms}
      renderItem={renderItem}
      onEndReached={() => {
        if (sms.length < count) {
          setPage(page + 1)
        }
      }}
      style={styles.body} >
      {sms.map((elm, i) => {
        return <MsgBody last={i == sms.length - 1} data={elm} key={i} />
      })}
    </FlatList>
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
