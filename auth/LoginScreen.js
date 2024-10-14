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

        navigation.reset({
          index: 0,
          routes: [{ name: userType === 'admin' ? 'AdminDrawer' : 'StudentDrawer' }],
        });
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
        <Text style={styles.title}>EduGuide - College Recommendation App</Text>

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

            {error ? <RNText style={styles.errorText}>{error}</RNText> : null}

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

        <Text style={styles.footerText}>All rights reserved 2023-24 by Jay Bartwal & Sujal</Text>
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
