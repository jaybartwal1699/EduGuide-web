import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text as RNText, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Title, Divider, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import config from '../config';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    setError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.SERVER_IP}/api/register`, {
        name,
        email,
        password,
        userType,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Registered successfully');
        navigation.navigate('Login');
      } else {
        setError('Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Registration failed. Please try again.');
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

            {error ? <RNText style={styles.errorText}>{error}</RNText> : null}

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
    maxWidth: 400,
    alignSelf: 'center',
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
