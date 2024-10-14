import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text as RNText, Alert } from 'react-native'; // Add Alert here
import { Text, TextInput, Button, Card, Title, Divider, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import config from '../config';

// Regular expression for validating email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Regular expression for validating password (at least 6 characters, and contains both letters and numbers)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!name || !email || !password) {
      setError('Please fill out all fields.');
      return false;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError('Name must contain only alphabetic characters.');
      return false;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return false;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 6 characters long and contain both letters and numbers.');
      return false;
    }

    setError(''); // Clear previous errors if validation passes
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      const response = await axios.post(`https://node-app-zie2.onrender.com/api/register`, {
        name,
        email,
        password,
        userType,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Registered successfully'); // This is where Alert is used
        navigation.navigate('Login');
      } else {
        setError('Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.message || 'Invalid input. Please try again.');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Register</Title>
            <Divider style={styles.divider} />

            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#6200ea' } }}
            />

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

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Student" value="student" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>

            {error ? (
              <RNText style={styles.errorText}>{error}</RNText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
              disabled={loading}
              contentStyle={styles.buttonContent}
            >
              {loading ? <ActivityIndicator animating={true} color="#FFFFFF" /> : 'Register'}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.loginButtonLabel}
            >
              Already have an account? Login here
            </Button>
          </Card.Content>
        </Card>
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
  pickerContainer: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#6200ea',
    paddingVertical: 8,
    borderRadius: 30,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  loginButton: {
    marginTop: 15,
  },
  loginButtonLabel: {
    color: '#6200ea',
  },
});






//Old Style Code & logic 

// import React, { useState } from 'react';
// import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';  // Updated import
// import axios from 'axios';  // Or use fetch if axios issues persist

// export default function RegisterScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [userType, setUserType] = useState('student');

//   const handleRegister = async () => {
//     if (!name || !email || !password) {
//       Alert.alert('Error', 'Please fill out all fields.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://:5000/api/register', {
//         name,
//         email,
//         password,
//         userType,
//       });

//       if (response.status === 201) {
//         Alert.alert('Success', 'Registered successfully');
//         navigation.navigate('Login');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Registration failed. Email might already be in use.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Picker
//         selectedValue={userType}
//         style={styles.input}
//         onValueChange={(itemValue) => setUserType(itemValue)}
//       >
//         <Picker.Item label="Student" value="student" />
//         <Picker.Item label="Admin" value="admin" />
//       </Picker>
//       <TouchableOpacity style={styles.button} onPress={handleRegister}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.switchText}>Already have an account? Login here</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   button: {
//     height: 50,
//     backgroundColor: '#6200ea',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   switchText: {
//     textAlign: 'center',
//     color: '#6200ea',
//   },
// });
