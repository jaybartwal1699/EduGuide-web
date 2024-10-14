// StudentDetail.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const StudentDetail = () => {
  // Hardcoded list of students
  const students = [
    { id: 1, name: 'John Doe', course: 'Computer Science', year: '3rd' },
    { id: 2, name: 'Jane Smith', course: 'Information Technology', year: '2nd' },
    { id: 3, name: 'Mike Johnson', course: 'Mechanical Engineering', year: '4th' },
    { id: 4, name: 'Sarah Brown', course: 'Electrical Engineering', year: '1st' },
    { id: 5, name: 'Emily Davis', course: 'Civil Engineering', year: '2nd' },
  ];

  // Render each student as a card
  const renderStudent = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>Course: {item.course}</Text>
      <Text style={styles.details}>Year: {item.year}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    color: '#555',
  },
});

export default StudentDetail;
