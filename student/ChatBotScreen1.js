import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import axios from 'axios';
import config from '../config';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatBotScreen = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [radioButtons, setRadioButtons] = useState([
    { id: '1', label: 'Engineering', value: 'Engineering', selected: true },
    { id: '2', label: 'B.Sc', value: 'B.Sc', selected: false },
    { id: '3', label: 'None', value: 'None', selected: false },
  ]);

  // Function to handle radio button selection
  const handleRadioButtonPress = (radioButtonsArray) => {
    setRadioButtons(radioButtonsArray);
  };

  // Function to fetch student info from API based on email and send data to recommendation service
  const handleFetchInfo = async () => {
    try {
      // Fetch the email from AsyncStorage
      const storedEmail = await AsyncStorage.getItem('email');

      if (!storedEmail) {
        setChat([...chat, { role: 'model', text: 'Email not found. Please log in again.' }]);
        return;
      }

      // Fetch additional data (location, parental income) using the API
      const response = await axios.get(`${config.SERVER_IP}/api/students/recommendationInfo`, {
        params: { email: storedEmail },
      });

      if (response.data) {
        const { location, fatherSalary, motherSalary } = response.data;

        // Get the selected specialization
        const selectedSpecialization = radioButtons.find(rb => rb.selected).value || 'None';

        console.log('Selected specialization:', selectedSpecialization);

        // Format the message to send the correct details to the recommendation service
        const recommendResponse = await axios.post(`https://flask-app-xhkt.onrender.com/message`, {
          message: `Recommending college based on the following details:\nEmail: ${storedEmail}\nLocation: ${location}\nFather's Income: ${fatherSalary}\nMother's Income: ${motherSalary}\nSelected Specialization: ${selectedSpecialization}`
        });

        // Update the chat with the response from the recommendation service
        setChat([
          ...chat,
          { role: 'user', text: `Sending the following details:\nEmail: ${storedEmail}\nLocation: ${location}\nFather's Income: ${fatherSalary}\nMother's Income: ${motherSalary}\nSpecialization: ${selectedSpecialization}` },
          { role: 'model', text: recommendResponse.data.response },
        ]);
      } else {
        setChat([...chat, { role: 'model', text: 'No student data found for this email.' }]);
      }

    } catch (error) {
      console.error('Error fetching student data:', error);
      setChat([...chat, { role: 'model', text: 'Failed to fetch student data.' }]);
    }
  };

  const handleSend = async () => {
    try {
      const response = await axios.post(`${config.SERVER_IP}:5012/message`, { message });
      setChat([
        ...chat,
        { role: 'user', text: message },
        { role: 'model', text: response.data.response },
      ]);
      setMessage('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <KeyboardAwareFlatList
        data={chat}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.role === 'model' ? styles.modelMessage : styles.userMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatList}
        keyboardShouldPersistTaps='handled'
      />

      {/* Radio buttons for Specializations */}
      <View style={styles.radioButtonContainer}>
        {radioButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={styles.radioButton}
            onPress={() => {
              const updatedButtons = radioButtons.map((rb) => ({
                ...rb,
                selected: rb.id === button.id,
              }));
              handleRadioButtonPress(updatedButtons);
            }}
          >
            <View style={styles.radioCircle}>
              {button.selected && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioLabel}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Button to fetch and send user info */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={handleFetchInfo}>
          <Text style={styles.sendButtonText}>Send My Info</Text>
        </TouchableOpacity>
      </View>

      {/* Message input and send button */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  chatList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1c4e9',
  },
  modelMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#7e57c2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  radioButtonContainer: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7e57c2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7e57c2',
  },
});

export default ChatBotScreen;
