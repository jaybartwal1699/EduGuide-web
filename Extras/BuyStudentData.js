import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Linking, ActivityIndicator, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';  // Ensure this contains your SERVER_IP

export default function BuyStudentData() {
  const [amount, setAmount] = useState('1');
  const [orderId, setOrderId] = useState(null);
  const [students, setStudents] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        setUserEmail(email);

        if (email) {
          const savedEmail = await AsyncStorage.getItem('paidEmail');
          if (email === savedEmail) {
            setHasPaid(true);
            setIsButtonDisabled(true);
            fetchStudentData();
          } else {
            setIsButtonDisabled(false);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving payment status or email:', error);
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    const uniqueOrderId = `ORDER_${Math.floor(Math.random() * 1000000)}`;
    const upiUrl = `upi://pay?pa=jaybartwal16-1@okaxis&pn=EduGuide&am=${amount}&cu=INR&tn=Buy Data&tr=${uniqueOrderId}`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        Linking.openURL(upiUrl).catch(() => Alert.alert('Error', 'Failed to redirect to UPI app'));

        // Simulate a delay for payment confirmation
        setTimeout(async () => {
          Alert.alert('Payment Confirmation', 'Please confirm if the payment was successful.');
          await AsyncStorage.setItem('hasPaid', 'true');
          await AsyncStorage.setItem('paidEmail', userEmail);
          setOrderId(uniqueOrderId);
          setHasPaid(true);
          setIsButtonDisabled(true);

          saveTransaction(userEmail, uniqueOrderId, parseFloat(amount));
          fetchStudentData();
        }, 5000);
      } else {
        Alert.alert('Error', 'No UPI app available');
      }
    } catch (error) {
      console.error('Error during UPI payment:', error);
    }
  };

  const saveTransaction = async (email, orderId, amount) => {
    try {
      const response = await axios.post(`${config.SERVER_IP}/transactions`, {
        email,
        orderId,
        amount
      });

      if (response.status === 201) {
        console.log('Transaction saved successfully:', response.data);
      } else {
        console.log('Failed to save transaction');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.SERVER_IP}/students`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch student data');
    }
  };

  const renderStudentCard = (student) => (
    <View style={styles.card} key={student._id}>
      <Image source={{ uri: student.photo }} style={styles.photo} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{student.email}</Text>
        <Text>Location: {student.location}</Text>
        <Text>Pin Code: {student.pinCode}</Text>
        <Text>Math: {student.marks10.math}</Text>
        <Text>English: {student.marks10.english}</Text>
        <Text>Science: {student.marks10.science}</Text>
        {student.is12thCompleted && (
          <>
            <Text>12th Biology: {student.marks12.biology}</Text>
            <Text>12th Math: {student.marks12.math}</Text>
            <Text>12th Physics: {student.marks12.physics}</Text>
            <Text>12th Chemistry: {student.marks12.chemistry}</Text>
          </>
        )}
        <Text>Interests: {student.interests}</Text>
        <Text>Hobbies: {student.hobbies}</Text>
        <Text>Field of Interest: {student.fieldOfInterest}</Text>
        <Text>Father's Name: {student.parents.fatherName}</Text>
        <Text>Mother's Name: {student.parents.motherName}</Text>
        <Text>Father's Occupation: {student.parents.fatherOccupation}</Text>
        <Text>Mother's Occupation: {student.parents.motherOccupation}</Text>
        <Text>Father's Salary: {student.parents.fatherSalary}</Text>
        <Text>Mother's Salary: {student.parents.motherSalary}</Text>
        <Image source={{ uri: student.markSheet }} style={styles.markSheet} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loaderText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>UPI Payment Integration</Text>
      {!hasPaid && (
        <>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount (e.g., 1 or 2)"
          />
          <Button
            title="Pay Now"
            onPress={handlePayment}
            disabled={isButtonDisabled}
          />
        </>
      )}

      {orderId && (
        <View style={styles.orderContainer}>
          <Text style={styles.orderText}>Order ID: {orderId}</Text>
        </View>
      )}

      {hasPaid && (
        <View>
          {students.map(student => renderStudentCard(student))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 18,
    alignSelf: 'center',
  },
  orderContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    backgroundColor: '#DFF2BF',
    alignItems: 'center',
  },
  orderText: {
    fontSize: 18,
    color: '#4CAF50',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  cardContent: {
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  markSheet: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
