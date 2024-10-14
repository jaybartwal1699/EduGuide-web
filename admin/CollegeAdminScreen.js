import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

export default function CollegeAdminScreen() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@collegeAdminData');
        if (jsonValue != null) {
          setAdminData(JSON.parse(jsonValue));
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load college admin data.');
      }
    };

    fetchData();
  }, []);

  if (!adminData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No College Admin data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>College Admin Details</Title>
          <Paragraph style={styles.label}>Email:</Paragraph>
          <Text style={styles.value}>{adminData.email}</Text>

          <Paragraph style={styles.label}>Location:</Paragraph>
          <Text style={styles.value}>{adminData.location}</Text>

          <Paragraph style={styles.label}>Pin Code:</Paragraph>
          <Text style={styles.value}>{adminData.pincode}</Text>

          <Paragraph style={styles.label}>University Affiliation:</Paragraph>
          <Text style={styles.value}>{adminData.universityAffiliation}</Text>

          <Paragraph style={styles.label}>NAAC Certification:</Paragraph>
          {adminData.naacCertPhoto ? (
            <Image source={{ uri: adminData.naacCertPhoto }} style={styles.image} />
          ) : (
            <Text style={styles.value}>No NAAC Certification uploaded</Text>
          )}

          <Paragraph style={styles.label}>Website:</Paragraph>
          <Text style={styles.value}>{adminData.website}</Text>

          <Paragraph style={styles.label}>Number of Branches:</Paragraph>
          <Text style={styles.value}>{adminData.noOfBranches}</Text>

          <Paragraph style={styles.label}>Branches:</Paragraph>
          {adminData.branches.map((branch, index) => (
            <Text key={index} style={styles.value}>• {branch}</Text>
          ))}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={styles.button} onPress={() => Alert.alert('Redirect', 'Edit functionality here')}>
            Edit Details
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
});