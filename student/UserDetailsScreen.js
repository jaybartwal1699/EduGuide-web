import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function UserDetailsScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        if (!email) {
          throw new Error('Email not found in AsyncStorage');
        }

        const response = await axios.get(`https://node-app-8ccf.onrender.com/api/students/byEmail`, {
          params: { email }
        });

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Fetch User Data Error:', err);
        setError(err.message);
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderData = (data) => {
    return Object.entries(data).map(([key, value], index) => {
      if (typeof value === 'string' && value.startsWith('/uploads/')) {
        const imageUrl = `https://node-app-8ccf.onrender.com${value}`;
        return (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{capitalizeFirstLetter(key)}:</Text>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
            />
          </View>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{capitalizeFirstLetter(key)}:</Text>
            <View style={styles.tableCell}>
              {renderData(value)}
            </View>
          </View>
        );
      } else {
        return (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{capitalizeFirstLetter(key)}:</Text>
            <Text style={styles.tableCell}>{value !== undefined ? value.toString() : 'N/A'}</Text>
          </View>
        );
      }
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load data: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {userData ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.header}>User Details</Text>
            <View style={styles.table}>
              {renderData(userData)}
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>No user data available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Lighter background for a modern look
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  detailsContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  table: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginLeft: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
