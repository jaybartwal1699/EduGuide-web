// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// import axios from 'axios';
// import config from '../config';

// const ChatBotScreen = () => {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);

//   const handleSend = async () => {
//     try {
//       const response = await axios.post(`${config.SERVER_IP}:5012/message`, { message });
//       setChat([
//         ...chat,
//         { role: 'user', text: message },
//         { role: 'model', text: response.data.response },
//       ]);
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <FlatList
//         data={chat}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={[
//             styles.messageContainer,
//             item.role === 'model' ? styles.modelMessage : styles.userMessage
//           ]}>
//             <Text style={styles.messageText}>{item.text}</Text>
//           </View>
//         )}
//         contentContainerStyle={styles.chatList}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type your message"
//           style={styles.textInput}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   chatList: {
//     flexGrow: 1,
//     justifyContent: 'flex-end',
//   },
//   messageContainer: {
//     marginVertical: 5,
//     borderRadius: 15,
//     padding: 10,
//     maxWidth: '80%',
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#d1c4e9',
//   },
//   modelMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#e0e0e0',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   textInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 20,
//     padding: 10,
//     backgroundColor: '#fff',
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: '#7e57c2',
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default ChatBotScreen;














import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
import axios from 'axios';
import config from '../config';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import { KeyboardAvoidingView } from 'react-native'; // Import if not already done

const ChatBotScreen = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // Function to fetch email from AsyncStorage when the user clicks 'Send My Info'
  const handleFetchInfo = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');

      if (!storedEmail) {
        setChat([...chat, { role: 'model', text: 'Email not found. Please log in again.' }]);
        return;
      }

      console.log('Fetched email from AsyncStorage:', storedEmail);

      const response = await axios.get(`${config.SERVER_IP}/api/students/recommendationInfo`, {
        params: { email: storedEmail },
      });

      if (response.data) {
        const { location, fatherSalary, motherSalary } = response.data;

        console.log('Fetched student details:', response.data);

        setChat([
          ...chat,
          { role: 'model', text: `Email: ${storedEmail}\nLocation: ${location}\nFather's Income: ${fatherSalary}\nMother's Income: ${motherSalary}` },
        ]);

        const recommendResponse = await axios.post(`https://flask-app-xhkt.onrender.com/message`, {
          message: `Recommending college based on the following details:} \nLocation: ${location}\n fee under ${fatherSalary}`
        });

        setChat([
          ...chat,
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
      Keyboard.dismiss();  // Dismiss the keyboard after sending the message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust keyboard behavior for iOS and Android
      keyboardVerticalOffset={90} // Adjust offset if needed
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
        keyboardShouldPersistTaps='handled' // Ensure taps on the FlatList work properly with the keyboard
      />

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
});

export default ChatBotScreen;
