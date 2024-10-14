import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import config from '../config';

export default function CollegeLocatorScreen() {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [colleges, setColleges] = useState([]);

  const fetchCoordinates = async () => {
    if (!location) return;

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=7c2c64e4233349f2b0e39a2ae9a49f16`);
      const { lat, lng } = response.data.results[0].geometry;
      setCoordinates({ latitude: lat, longitude: lng });
      fetchColleges(lat, lng);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const fetchColleges = async (latitude, longitude) => {
    try {
      const response = await axios.get(`${config.SERVER_IP}:5006/colleges`, {
        params: {
          lat: latitude,
          lng: longitude,
        },
      });
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Search" onPress={fetchCoordinates} />

      {coordinates && (
        <MapView
          style={styles.map}
          region={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {colleges.map((college, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: college.latitude,
                longitude: college.longitude,
              }}
              title={college.name}
            />
          ))}
        </MapView>
      )}

      {colleges.length > 0 && (
        <FlatList
          data={colleges}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.collegeItem}>
              <Text>{item.name}</Text>
              <Text>{item.address}</Text>
              <Text>{item.city}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  collegeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
