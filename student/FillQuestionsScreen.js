import React from 'react';
import { ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function FillQuestionsScreen() {
  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.label}>Interests:</Text>
      <TextInput style={styles.input} placeholder="Enter your interests" />

      <Text style={styles.label}>Hobbies:</Text>
      <TextInput style={styles.input} placeholder="Enter your hobbies" />

      <Text style={styles.label}>Field of Interest:</Text>
      <TextInput style={styles.input} placeholder="Enter your field of interest" />

      <Button mode="contained" style={styles.submitButton} onPress={() => console.log('Submitted')}>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#B3E5FC',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  submitButton: {
    marginVertical: 20,
    backgroundColor: '#4CAF50',
  },
});
