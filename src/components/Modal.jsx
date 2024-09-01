import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export const ModalComponent = ({ showCancelButton = false, reject = () => { }, modalVisible, message, accept, showButton = true, buttonText = 'Понятно' }) => {
  return <View style={styles.centeredView}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => { }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={{ gap: 10 }}>
            {showButton && <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                accept()
              }}>
              <Text style={styles.textStyle}>{buttonText}</Text>
            </TouchableOpacity>}
            {showCancelButton && <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                reject()
              }}>
              <Text style={styles.textStyle}>Вернуться в меню</Text>
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    </Modal>
  </View>
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
