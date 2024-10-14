import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native';
import { Text, TextInput, Button, Card, Title, Divider, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const response = await axios.post(`${config.SERVER_IP}/api/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, userType, name } = response.data;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('userType', userType);
        await AsyncStorage.setItem('name', name);

        if (userType === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AdminDrawer' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'StudentDrawer' }],
          });
        }
      }
    } catch (error) {
      setError('Login failed. Check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>
          EduGuide - College Recommendation App
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>EduGuide</Title>
            <Divider style={styles.divider} />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#6200ea' } }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#6200ea' } }}
            />

            {error ? (
              <RNText style={styles.errorText}>{error}</RNText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
              disabled={loading}
              contentStyle={styles.buttonContent}
            >
              {loading ? <ActivityIndicator animating={true} color="#FFFFFF" /> : 'Login'}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.registerButtonLabel}
            >
              Don't have an account? Register
            </Button>

          </Card.Content>
        </Card>

        <Text style={styles.footerText}>
          All rights reserved 2023-24 by Jay Bartwal & Sujal
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ea',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 28,
    color: '#6200ea',
  },
  divider: {
    marginBottom: 20,
    backgroundColor: '#6200ea',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ea',
    paddingVertical: 8,
    borderRadius: 30,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  registerButton: {
    marginTop: 15,
  },
  registerButtonLabel: {
    color: '#6200ea',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 14,
  },
});




// Old Layot code 

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill out all fields.');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Make sure the URL is correct
//       const response = await axios.post('http://x.x.x.x:5000/api/login', { // Replace with your actual URL
//         email,
//         password,
//       });

//       if (response.status === 200) {
//         const { token, userType, name } = response.data;

//         // Save token and email in AsyncStorage
//         await AsyncStorage.setItem('token', token);
//         await AsyncStorage.setItem('email', email); // Save email for fetching user details
//         await AsyncStorage.setItem('userType', userType);
//         await AsyncStorage.setItem('name', name); // Save user name if needed

//         // Debug: Check what is stored in AsyncStorage
//         const storedToken = await AsyncStorage.getItem('token');
//         const storedEmail = await AsyncStorage.getItem('email');
//         const storedUserType = await AsyncStorage.getItem('userType');
//         const storedName = await AsyncStorage.getItem('name');
//         console.log('Stored Token:', storedToken);
//         console.log('Stored Email:', storedEmail);
//         console.log('Stored UserType:', storedUserType);
//         console.log('Stored Name:', storedName);

//         // Navigate based on user type
//         if (userType === 'admin') {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'AdminDrawer' }],
//           });
//         } else {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'StudentDrawer' }],
//           });
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Login failed. Check your credentials.');
//       console.error('Login error:', error); // Log error for debugging
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>EduGuide</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={(text) => setEmail(text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={(text) => setPassword(text)}
//       />
//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.link}
//         onPress={() => navigation.navigate('Register')}
//       >
//         <Text style={styles.linkText}>Don't have an account? Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//     textAlign: 'center',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 16,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   link: {
//     marginTop: 16,
//     alignItems: 'center',
//   },
//   linkText: {
//     color: '#007bff',
//     fontSize: 16,
//   },
// });
