import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, Image } from 'react-native';
import { Text, Button, Card, Title, Divider, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

export default function AdvertiseCollege() {
  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyAdvertised, setAlreadyAdvertised] = useState(false);

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@collegeAdminData');
        if (jsonValue != null) {
          setCollegeData(JSON.parse(jsonValue));
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load college data.');
      }
    };

    const checkAdvertisedStatus = async () => {
      try {
        const advertisedStatus = await AsyncStorage.getItem('@collegeAdvertised');
        if (advertisedStatus) {
          setAlreadyAdvertised(true);
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to check advertised status.');
      }
    };

    fetchCollegeData();
    checkAdvertisedStatus();
  }, []);

  const handleAdvertise = async () => {
    if (!collegeData) {
        Alert.alert('Error', 'College data is missing.');
        return;
    }

    setLoading(true);

    try {
      const advertiseResponse = await axios.post(`${config.SERVER_IP}/advertiseCollege`, collegeData);

      if (advertiseResponse.status === 201) {  // 201 for created
        await AsyncStorage.setItem('@collegeAdvertised', 'true');
        Alert.alert('Success', 'College advertised successfully!');
      } else {
        Alert.alert('Error', 'Failed to advertise college.');
      }
    } catch (error) {
      console.error('Error during advertising', error);
      Alert.alert('Error', 'An error occurred while advertising the college.');
    } finally {
      setLoading(false);
    }
};


  if (alreadyAdvertised) {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Title style={styles.title}>College Already Advertised</Title>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Advertised Status</Title>
              <Divider style={styles.divider} />
              
              <Text style={styles.value}>This college has already been advertised.</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (!collegeData) {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.emptyText}>No College data found.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Title style={styles.title}>College Details</Title>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>College Information</Title>
            <Divider style={styles.divider} />

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{collegeData.email}</Text>

            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{collegeData.location}</Text>

            <Text style={styles.label}>Pin Code:</Text>
            <Text style={styles.value}>{collegeData.pincode}</Text>

            <Text style={styles.label}>University Affiliation:</Text>
            <Text style={styles.value}>{collegeData.universityAffiliation}</Text>

            <Text style={styles.label}>NAAC Certification:</Text>
            {collegeData.naacCertPhoto ? (
              <Image source={{ uri: collegeData.naacCertPhoto }} style={styles.image} />
            ) : (
              <Text style={styles.value}>No NAAC Certification uploaded</Text>
            )}

            <Text style={styles.label}>Website:</Text>
            <Text style={styles.value}>{collegeData.website}</Text>

            <Text style={styles.label}>Number of Branches:</Text>
            <Text style={styles.value}>{collegeData.noOfBranches}</Text>

            <Text style={styles.label}>Branches:</Text>
            {collegeData.branches.map((branch, index) => (
              <Text key={index} style={styles.value}>• {branch}</Text>
            ))}

            <Button
              mode="contained"
              onPress={handleAdvertise}
              loading={loading}
              style={styles.button}
              disabled={loading}
            >
              {loading ? <ActivityIndicator animating={true} color="#FFFFFF" /> : 'Advertise College'}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ea',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#6200ea',
  },
  divider: {
    marginBottom: 20,
    backgroundColor: '#6200ea',
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
    borderRadius: 30,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
  },
});
