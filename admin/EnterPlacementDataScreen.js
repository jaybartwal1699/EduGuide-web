import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useTheme } from 'react-native-paper'; // Ensure consistent theming across the app
import config from '../config';

export default function UploadPlacementScreen() {
  const [collegeName, setCollegeName] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState(null);
  const theme = useTheme(); // Get theme colors for consistent styling

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFile(file);
      } else if (result.canceled) {
        console.log('File picker was canceled');
      } else {
        console.log('Unexpected file picker result:', result);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const uploadFile = async () => {
    if (!collegeName || !year || !file) {
      Alert.alert('Error', 'Please provide all the details and select a file.');
      return;
    }
    
    const formData = new FormData();
    formData.append('placementFile', {
      uri: file.uri,
      type: file.mimeType || 'application/pdf',
      name: file.name,
    });
    formData.append('collegeName', collegeName);
    formData.append('year', year);
    
    try {
      const response = await axios.post(`${config.SERVER_IP}/upload-placement`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server response:', response.data);
      Alert.alert('Success', 'Placement data uploaded successfully!');
      setCollegeName('');
      setYear('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to upload placement data.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Placement Data</Text>
      
      <TextInput
        style={styles.input}
        placeholder="College Name"
        value={collegeName}
        onChangeText={setCollegeName}
        placeholderTextColor="#888"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Year"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={selectFile}>
        <Text style={styles.buttonText}>Select PDF File</Text>
      </TouchableOpacity>

      {file && <Text style={styles.fileName}>{file.name}</Text>}

      <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={uploadFile}>
        <Text style={styles.buttonText}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
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
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#388e3c',
  },
  fileName: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    fontSize: 16,
  },
});
