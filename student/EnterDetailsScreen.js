import React, { useState } from 'react';
import { ScrollView, View, Image, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Title, Divider, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function EnterDetailsScreen() {
  const [photo, setPhoto] = useState(null);
  const [markSheet, setMarkSheet] = useState(null);
  const [is12thCompleted, setIs12thCompleted] = useState(false);
  const [marks10, setMarks10] = useState({ math: '', english: '', science: '' });
  const [marks12, setMarks12] = useState({ biology: '', math: '', physics: '', chemistry: '' });
  const [parents, setParents] = useState({
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    motherOccupation: '',
    fatherSalary: '',
    motherSalary: '',
  });
  const [location, setLocation] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [interests, setInterests] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const [email, setEmail] = useState('');

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
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

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      formData.append('email', email);
      formData.append('location', location);
      formData.append('pinCode', pinCode);
      formData.append('marks10', JSON.stringify(marks10));
      formData.append('is12thCompleted', JSON.stringify(is12thCompleted));
      formData.append('marks12', JSON.stringify(marks12));
      formData.append('parents', JSON.stringify(parents));
      formData.append('interests', interests);
      formData.append('hobbies', hobbies);
      formData.append('fieldOfInterest', fieldOfInterest);

      if (photo) {
        formData.append('photo', {
          uri: photo,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }

      if (markSheet) {
        formData.append('markSheet', {
          uri: markSheet,
          type: 'image/jpeg',
          name: 'markSheet.jpg',
        });
      }

      const response = await fetch(`${config.SERVER_IP}/api/students/submitDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Details saved successfully');
      } else {
        Alert.alert('Error', 'Failed to save details');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong: ' + error.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <Card style={{ marginBottom: 20 }}>
        <Card.Content>
          <Title>Enter Your Details</Title>
          <Divider style={{ marginBottom: 20 }} />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            mode="outlined"
            style={{ marginBottom: 15 }}
          />

          <Button mode="contained" style={{ marginVertical: 10 }} onPress={getLocation}>
            Auto-fill Location
          </Button>

          <Text style={{ marginBottom: 15 }}>{location || 'Location not detected'}</Text>
          <Text style={{ marginBottom: 20 }}>{pinCode || 'Pin Code not detected'}</Text>

          <Title>10th Grade Marks:</Title>
          {['math', 'english', 'science'].map((subject) => (
            <TextInput
              key={subject}
              label={subject.charAt(0).toUpperCase() + subject.slice(1)}
              value={marks10[subject]}
              onChangeText={(text) => setMarks10({ ...marks10, [subject]: text })}
              mode="outlined"
              style={{ marginBottom: 15 }}
            />
          ))}

          <Text>Did you complete 12th Grade?</Text>
          <Button
            mode="contained"
            style={{ marginVertical: 10, backgroundColor: is12thCompleted ? '#0288d1' : '#e57373' }}
            onPress={() => setIs12thCompleted(!is12thCompleted)}
          >
            {is12thCompleted ? 'Yes' : 'No'}
          </Button>

          {is12thCompleted && (
            <>
              <Title>12th Grade Marks:</Title>
              {['biology', 'math', 'physics', 'chemistry'].map((subject) => (
                <TextInput
                  key={subject}
                  label={subject.charAt(0).toUpperCase() + subject.slice(1)}
                  value={marks12[subject]}
                  onChangeText={(text) => setMarks12({ ...marks12, [subject]: text })}
                  mode="outlined"
                  style={{ marginBottom: 15 }}
                />
              ))}
            </>
          )}

          <Title>Parents' Details:</Title>
          {['fatherName', 'motherName', 'fatherOccupation', 'motherOccupation', 'fatherSalary', 'motherSalary'].map((field) => (
            <TextInput
              key={field}
              label={field.replace(/([A-Z])/g, ' $1').trim()}
              value={parents[field]}
              onChangeText={(text) => setParents({ ...parents, [field]: text })}
              mode="outlined"
              style={{ marginBottom: 15 }}
            />
          ))}

          <TextInput
            label="Interests"
            value={interests}
            onChangeText={setInterests}
            mode="outlined"
            style={{ marginBottom: 15 }}
          />

          <TextInput
            label="Hobbies"
            value={hobbies}
            onChangeText={setHobbies}
            mode="outlined"
            style={{ marginBottom: 15 }}
          />

          <TextInput
            label="Field of Interest"
            value={fieldOfInterest}
            onChangeText={setFieldOfInterest}
            mode="outlined"
            style={{ marginBottom: 15 }}
          />

          <Title>Upload Photo:</Title>
          <Button mode="contained" style={{ marginVertical: 10 }} onPress={() => pickImage(setPhoto)}>
            Pick a Photo
          </Button>
          {photo && <Image source={{ uri: photo }} style={{ width: 120, height: 120, resizeMode: 'cover', borderRadius: 10, marginVertical: 10 }} />}

          <Title>Upload Mark Sheet:</Title>
          <Button mode="contained" style={{ marginVertical: 10 }} onPress={() => pickImage(setMarkSheet)}>
            Pick a Mark Sheet
          </Button>
          {markSheet && <Image source={{ uri: markSheet }} style={{ width: 120, height: 120, resizeMode: 'cover', borderRadius: 10, marginVertical: 10 }} />}

          <Button mode="contained" style={{ backgroundColor: '#388e3c' }} onPress={handleSubmit}>
            Submit
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}






//old code backup


// import React, { useState } from 'react';
// import { ScrollView, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
// import { Button } from 'react-native-paper';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function EnterDetailsScreen() {
//   const [photo, setPhoto] = useState(null);
//   const [markSheet, setMarkSheet] = useState(null);
//   const [is12thCompleted, setIs12thCompleted] = useState(false);
//   const [marks10, setMarks10] = useState({ math: '', english: '', science: '' });
//   const [marks12, setMarks12] = useState({ biology: '', math: '', physics: '', chemistry: '' });
//   const [parents, setParents] = useState({
//     fatherName: '',
//     motherName: '',
//     fatherOccupation: '',
//     motherOccupation: '',
//     fatherSalary: '',
//     motherSalary: '',
//   });
//   const [location, setLocation] = useState('');
//   const [pinCode, setPinCode] = useState('');
//   const [interests, setInterests] = useState('');
//   const [hobbies, setHobbies] = useState('');
//   const [fieldOfInterest, setFieldOfInterest] = useState('');
//   const [email, setEmail] = useState('');

//   // Function to pick an image from the gallery
//   const pickImage = async (setImage) => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   // Function to get the user's current location
//   const getLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     let { latitude, longitude } = location.coords;
//     let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

//     if (geocode.length > 0) {
//       let address = geocode[0];
//       setLocation(`${address.city}, ${address.region}, ${address.country}`);
//       setPinCode(address.postalCode || '');
//     }
//   };

//   // Function to handle form submission
//   const handleSubmit = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
//       const formData = new FormData();

//       formData.append('email', email);
//       formData.append('location', location);
//       formData.append('pinCode', pinCode);
//       formData.append('marks10', JSON.stringify(marks10));
//       formData.append('is12thCompleted', JSON.stringify(is12thCompleted));
//       formData.append('marks12', JSON.stringify(marks12));
//       formData.append('parents', JSON.stringify(parents));
//       formData.append('interests', interests);
//       formData.append('hobbies', hobbies);
//       formData.append('fieldOfInterest', fieldOfInterest);

//       if (photo) {
//         formData.append('photo', {
//           uri: photo,
//           type: 'image/jpeg', // Correct MIME type
//           name: 'photo.jpg',
//         });
//       }

//       if (markSheet) {
//         formData.append('markSheet', {
//           uri: markSheet,
//           type: 'image/jpeg', // Correct MIME type
//           name: 'markSheet.jpg',
//         });
//       }

//       const response = await fetch('http://:5001/api/students/submitDetails', { // Adjust to your server URL
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`, // Include token in Authorization header
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Details saved successfully');
//       } else {
//         Alert.alert('Error', 'Failed to save details');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong: ' + error.message);
//     }
//   };

//   return (
//     <ScrollView style={styles.formContainer}>
//       <Text style={styles.label}>Email:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <Text style={styles.label}>Location:</Text>
//       <Button mode="contained" style={styles.button} onPress={getLocation}>
//         Auto-fill Location
//       </Button>
//       <Text style={styles.input}>{location || 'Location not detected'}</Text>

//       <Text style={styles.label}>Pin Code:</Text>
//       <Text style={styles.input}>{pinCode || 'Pin Code not detected'}</Text>

//       <Text style={styles.sectionTitle}>10th Grade Marks:</Text>
//       {['math', 'english', 'science'].map((subject) => (
//         <TextInput
//           key={subject}
//           style={styles.input}
//           placeholder={subject.charAt(0).toUpperCase() + subject.slice(1)}
//           value={marks10[subject]}
//           onChangeText={(text) => setMarks10({ ...marks10, [subject]: text })}
//         />
//       ))}

//       <Text style={styles.label}>Did you complete 12th Grade?</Text>
//       <TouchableOpacity style={styles.toggleButton} onPress={() => setIs12thCompleted(!is12thCompleted)}>
//         <Text style={styles.toggleButtonText}>{is12thCompleted ? 'Yes' : 'No'}</Text>
//       </TouchableOpacity>

//       {is12thCompleted && (
//         <>
//           <Text style={styles.sectionTitle}>12th Grade Marks:</Text>
//           {['biology', 'math', 'physics', 'chemistry'].map((subject) => (
//             <TextInput
//               key={subject}
//               style={styles.input}
//               placeholder={subject.charAt(0).toUpperCase() + subject.slice(1)}
//               value={marks12[subject]}
//               onChangeText={(text) => setMarks12({ ...marks12, [subject]: text })}
//             />
//           ))}
//         </>
//       )}

//       <Text style={styles.sectionTitle}>Parents' Details:</Text>
//       {['fatherName', 'motherName', 'fatherOccupation', 'motherOccupation', 'fatherSalary', 'motherSalary'].map((field) => (
//         <TextInput
//           key={field}
//           style={styles.input}
//           placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
//           value={parents[field]}
//           onChangeText={(text) => setParents({ ...parents, [field]: text })}
//         />
//       ))}

//       <Text style={styles.label}>Interests:</Text>
//       <TextInput
//         style={styles.input}
//         value={interests}
//         onChangeText={setInterests}
//       />

//       <Text style={styles.label}>Hobbies:</Text>
//       <TextInput
//         style={styles.input}
//         value={hobbies}
//         onChangeText={setHobbies}
//       />

//       <Text style={styles.label}>Field of Interest:</Text>
//       <TextInput
//         style={styles.input}
//         value={fieldOfInterest}
//         onChangeText={setFieldOfInterest}
//       />

//       <Text style={styles.sectionTitle}>Upload Photo:</Text>
//       <Button mode="contained" style={styles.button} onPress={() => pickImage(setPhoto)}>
//         Pick a Photo
//       </Button>
//       {photo && <Image source={{ uri: photo }} style={styles.uploadedImage} />}

//       <Text style={styles.sectionTitle}>Upload Mark Sheet:</Text>
//       <Button mode="contained" style={styles.button} onPress={() => pickImage(setMarkSheet)}>
//         Pick a Mark Sheet
//       </Button>
//       {markSheet && <Image source={{ uri: markSheet }} style={styles.uploadedImage} />}

//       <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
//         Submit
//       </Button>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   formContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#ffffff',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginVertical: 10,
//     color: '#333',
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#B3E5FC',
//     padding: 10,
//     fontSize: 16,
//     marginBottom: 15,
//     color: '#333',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginVertical: 15,
//     color: '#333',
//   },
//   uploadedImage: {
//     width: 120,
//     height: 120,
//     resizeMode: 'cover',
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   button: {
//     marginVertical: 10,
//     backgroundColor: '#0277BD',
//   },
//   toggleButton: {
//     padding: 10,
//     alignItems: 'center',
//     marginVertical: 10,
//     borderRadius: 5,
//     backgroundColor: '#0277BD',
//   },
//   toggleButtonText: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   submitButton: {
//     marginVertical: 20,
//     backgroundColor: '#00796B',
//   },
// });
