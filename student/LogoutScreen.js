import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      // Clear the token and userType from AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userType');

      // Reset the navigation state
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };

    logout();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Logging Out...</Text>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 5,
    color: '#333',
  },
});
