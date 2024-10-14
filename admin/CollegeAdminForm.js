import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Image, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';


export default function CollegeAdminForm() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [universityAffiliation, setUniversityAffiliation] = useState('');
  const [naacCertPhoto, setNaacCertPhoto] = useState(null);
  const [website, setWebsite] = useState('');
  const [noOfBranches, setNoOfBranches] = useState('');
  const [branches, setBranches] = useState([]);

  const navigation = useNavigation();

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let { latitude, longitude } = location.coords;
    let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (geocode.length > 0) {
      let address = geocode[0];
      setLocation(`${address.city}, ${address.region}, ${address.country}`);
      setPinCode(address.postalCode || '');
    }
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNaacCertPhoto(result.assets[0].uri);
    }
  };

  const validateWebsite = (url) => {
    const regex = /^(https?:\/\/)?([\w\d-]+\.){1,2}[\w\d-]+(\/[\w\d-]+)*\/?$/;
    return regex.test(url);
  };

  const validateFields = () => {
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!location) {
      Alert.alert('Error', 'Please get your location');
      return false;
    }
    if (!pinCode) {
      Alert.alert('Error', 'Please enter a valid pin code');
      return false;
    }
    if (!universityAffiliation) {
      Alert.alert('Error', 'Please enter university affiliation');
      return false;
    }
    if (!naacCertPhoto) {
      Alert.alert('Error', 'Please upload NAAC certification photo');
      return false;
    }
    if (!validateWebsite(website)) {
      Alert.alert('Error', 'Please enter a valid website URL');
      return false;
    }
    if (!noOfBranches) {
      Alert.alert('Error', 'Please enter the number of branches');
      return false;
    }
    if (branches.some(name => name.trim() === '')) {
      Alert.alert('Validation Error', 'All branch names must be filled.');
      return false;
    }
    return true;
  };

  const handleBranchNamesChange = (index, value) => {
    const newBranchNames = [...branches];
    newBranchNames[index] = value;
    setBranches(newBranchNames);
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const collegeAdminData = {
      email,
      location,
      pincode: pinCode,
      universityAffiliation,
      naacCertPhoto,
      website,
      noOfBranches,
      branches,
    };

    try {
      const jsonValue = JSON.stringify(collegeAdminData);
      await AsyncStorage.setItem('@collegeAdminData', jsonValue);
      console.log('College Admin data saved locally');

      const response = await axios.post(`${config.SERVER_IP}/collegeAdminData`, collegeAdminData);
      if (response.status === 201) {
        Alert.alert('Success', 'College Admin data submitted successfully');
        navigation.navigate('CollegeAdminScreen');
      } else {
          Alert.alert('Error', `Error submitting College Admin data: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting details', error);
      Alert.alert('Error', 'Error submitting College Admin data');
    }
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.title}>Welcome, College Admin!</Text>
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Location:</Text>
      <View style={styles.inlineContainer}>
        <Text style={styles.input}>{location || 'Location not detected'}</Text>
        <Button mode="contained" style={styles.smallButton} onPress={getLocation}>
          Auto-fill
        </Button>
      </View>

      <Text style={styles.label}>Pin Code:</Text>
      <Text style={styles.input}>{pinCode || 'Pin Code not detected'}</Text>

      <Text style={styles.label}>University Affiliation:</Text>
      <TextInput
        style={styles.input}
        placeholder="University Affiliation"
        value={universityAffiliation}
        onChangeText={setUniversityAffiliation}
      />

      <Text style={styles.label}>NAAC Certification:</Text>
      <Button mode="contained" style={styles.button} onPress={pickPhoto}>
        Upload NAAC Certification Photo
      </Button>

      {naacCertPhoto && (
        <Image source={{ uri: naacCertPhoto }} style={styles.uploadedImage} />
      )}

      <Text style={styles.label}>Website:</Text>
      <TextInput
        style={styles.input}
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
      />

      <Text style={styles.label}>Number of Branches:</Text>
      <TextInput
        style={styles.input}
        placeholder="Number of Branches"
        value={noOfBranches}
        onChangeText={(value) => {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            setNoOfBranches(value);
            setBranches(Array.from({ length: parsedValue }, () => ''));
          } else {
            setNoOfBranches('');
            setBranches([]);
          }
        }}
        keyboardType="numeric"
      />

      {Array.from({ length: parseInt(noOfBranches, 10) || 0 }).map((_, index) => (
        <View key={index}>
          <Text style={styles.label}>Branch Name {index + 1}:</Text>
          <TextInput
            style={styles.input}
            placeholder={`Branch Name ${index + 1}`}
            value={branches[index]}
            onChangeText={(value) => handleBranchNamesChange(index, value)}
          />
        </View>
      ))}

      <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
        Submit
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ea',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    marginLeft: 10,
    backgroundColor: '#6200ea',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ea',
  },
  submitButton: {
    marginVertical: 30,
    backgroundColor: '#4CAF50',
    alignSelf: 'center',
    width: '50%',
  },
});
