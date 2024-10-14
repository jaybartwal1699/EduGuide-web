import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Divider, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // Updated import
import config from '../config';

const AdminCollegeDataScren = () => {
  const [collegeData, setCollegeData] = useState({
    college_id: '',
    college_name: '',
    location: '',
    affiliated_university: '',
    course_offered: '',
    specializations: '',
    course_duration: '',
    fee_structure: '',
    scholarship_available: 'No',
    eligibility_criteria: '',
    distance_from_student: '',
    student_satisfaction_rate: '',
    placement_rate: '',
    hostel_available: 'No',
    campus_size: '',
    mode_of_education: 'Offline',
    nacc_rating: ''
  });

  const handleInputChange = (key, value) => {
    setCollegeData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleSelectChange = (key, value) => {
    setCollegeData(prevData => ({ ...prevData, [key]: value }));
  };

  const validateData = () => {
    if (!collegeData.college_id || !collegeData.college_name) {
      Alert.alert('Validation Error', 'College ID and Name are required.');
      return false;
    }
    return true;
  };

  const submitData = async () => {
    if (!validateData()) return;

    try {
      const response = await fetch(`${config.SERVER_IP}/colleges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collegeData),
      });

      if (response.ok) {
        Alert.alert("Success", "College data added successfully!");
        setCollegeData({
          college_id: '',
          college_name: '',
          location: '',
          affiliated_university: '',
          course_offered: '',
          specializations: '',
          course_duration: '',
          fee_structure: '',
          scholarship_available: 'No',
          eligibility_criteria: '',
          distance_from_student: '',
          student_satisfaction_rate: '',
          placement_rate: '',
          hostel_available: 'No',
          campus_size: '',
          mode_of_education: 'Offline',
          nacc_rating: ''
        });
      } else {
        Alert.alert("Error", "Failed to add college data.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while submitting the data.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Add College Data for Recommendation</Title>
          <Divider style={styles.divider} />

          <TextInput
            label="College ID"
            value={collegeData.college_id}
            onChangeText={(value) => handleInputChange('college_id', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="College Name"
            value={collegeData.college_name}
            onChangeText={(value) => handleInputChange('college_name', value)}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Location"
            value={collegeData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Affiliated University"
            value={collegeData.affiliated_university}
            onChangeText={(value) => handleInputChange('affiliated_university', value)}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Course Offered"
            value={collegeData.course_offered}
            onChangeText={(value) => handleInputChange('course_offered', value)}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Specializations (comma-separated)"
            value={collegeData.specializations}
            onChangeText={(value) => handleInputChange('specializations', value)}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Course Duration (years)"
            value={collegeData.course_duration}
            onChangeText={(value) => handleInputChange('course_duration', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Fee Structure"
            value={collegeData.fee_structure}
            onChangeText={(value) => handleInputChange('fee_structure', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Scholarship Available</Text>
            <Picker
              selectedValue={collegeData.scholarship_available}
              style={styles.picker}
              onValueChange={(itemValue) => handleSelectChange('scholarship_available', itemValue)}
            >
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>

          <TextInput
            label="Eligibility Criteria"
            value={collegeData.eligibility_criteria}
            onChangeText={(value) => handleInputChange('eligibility_criteria', value)}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Distance from Student (km)"
            value={collegeData.distance_from_student}
            onChangeText={(value) => handleInputChange('distance_from_student', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Student Satisfaction Rate (%)"
            value={collegeData.student_satisfaction_rate}
            onChangeText={(value) => handleInputChange('student_satisfaction_rate', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <TextInput
            label="Placement Rate (%)"
            value={collegeData.placement_rate}
            onChangeText={(value) => handleInputChange('placement_rate', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Hostel Available</Text>
            <Picker
              selectedValue={collegeData.hostel_available}
              style={styles.picker}
              onValueChange={(itemValue) => handleSelectChange('hostel_available', itemValue)}
            >
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>

          <TextInput
            label="Campus Size (acres)"
            value={collegeData.campus_size}
            onChangeText={(value) => handleInputChange('campus_size', value)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Mode of Education</Text>
            <Picker
              selectedValue={collegeData.mode_of_education}
              style={styles.picker}
              onValueChange={(itemValue) => handleSelectChange('mode_of_education', itemValue)}
            >
              <Picker.Item label="Offline" value="Offline" />
              <Picker.Item label="Online" value="Online" />
            </Picker>
          </View>

          <TextInput
            label="NAAC Rating"
            value={collegeData.nacc_rating}
            onChangeText={(value) => handleInputChange('nacc_rating', value)}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
          />
        </Card.Content>
      </Card>

      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          Note: This data is used for the recommendation of colleges to students. Please ensure accuracy.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={submitData} style={styles.button} theme={{ colors: { primary: '#6200ea' } }}>
          Submit Data
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  input: {
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#6200ea',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f6f6f6',
    borderRadius: 5,
  },
  noteContainer: {
    marginVertical: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  button: {
    width: '60%',
    borderRadius: 25,
  },
});

export default AdminCollegeDataScren;
