import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedEmail = await AsyncStorage.getItem('email');

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Failed to fetch user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  // Handler functions for card clicks
  const handleEnterCollegeDetails = () => {
    console.log('Enter College Details clicked');
    // Navigate to the Enter College Details screen or perform an action
    navigation.navigate('College Details'); // Navigate to CollegeAdminForm
  };

  const handleEnterPlacementData = () => {
    navigation.navigate('Placement Data Collection');
    // Navigate to the Enter Placement Data screen or perform an action
  };

  const handleAddNAACNBARating = () => {
    console.log('Add NAAC/NBA Rating clicked');
    navigation.navigate('College Details');
    // Navigate to the Add NAAC/NBA Rating screen or perform an action
  };

  const handleAddAds = () => {
    console.log('Add Ads clicked');
    // Navigate to the Add Ads screen or perform an action
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.userCard}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.profileContainer}>
            <IconButton
              icon="account-circle"
              size={100}
              color="#3F51B5"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name || 'Name not available'}</Text>
            <Text style={styles.email}>{email || 'Email not available'}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={handleEnterCollegeDetails}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="school" size={30} color="#4CAF50" />
            <Text style={styles.optionText}>Enter College Details</Text>
          </Card.Content>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleEnterPlacementData}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="briefcase" size={30} color="#FF9800" />
            <Text style={styles.optionText}>Enter Placement Data</Text>
          </Card.Content>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleAddNAACNBARating}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="star" size={30} color="#FFC107" />
            <Text style={styles.optionText}>Add NAAC/NBA Rating</Text>
          </Card.Content>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleAddAds}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="bullhorn" size={30} color="#F44336" />
            <Text style={styles.optionText}>Add Ads</Text>
          </Card.Content>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  userCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
  },
  profileContainer: {
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 4,
    justifyContent: 'center',
  },
  optionContent: {
    alignItems: 'center',
    padding: 15,
  },
  optionText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
