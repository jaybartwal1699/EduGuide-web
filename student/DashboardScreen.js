import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageError, setImageError] = useState(false); // Track image load errors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedEmail = await AsyncStorage.getItem('email');
        
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);

        // Fetch user data from API
        const emailFromStorage = storedEmail || '';
        try {
          const response = await axios.get(`${config.SERVER_IP}/api/students/byEmail`, {
            params: { email: emailFromStorage }
          });

          if (response.status === 200) {
            setUserData(response.data);
          } else {
            // Handle case where user is not found
            console.log('User not found');
          }
        } catch (err) {
          console.error('Error fetching user data:', err.message);
        }
      } catch (err) {
        console.error('Error accessing AsyncStorage:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Default placeholder image URL
  const placeholderImage = 'https://via.placeholder.com/100';

  // Image URL construction with error handling
  const imageUrl = userData?.photo ? `${config.SERVER_IP}${userData.photo}` : placeholderImage;

  // Function to handle image errors
  const handleImageError = () => {
    setImageError(true); // Set image error state
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ea" />
      ) : (
        <Card style={styles.userCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.profileImage}
                onError={handleImageError} // Handle image load errors
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{name || 'Name not available'}</Text>
              <Text style={styles.email}>{email || 'Email not available'}</Text>
              {imageError && <Text style={styles.imageErrorText}>No image found</Text>}
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('Filter')}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="school" size={30} color="#6200ea" />
            <Text style={styles.optionText}>Search College</Text>
          </Card.Content>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('Recommendations')}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="compass" size={30} color="#6200ea" />
            <Text style={styles.optionText}>Find Future Path</Text>
          </Card.Content>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('Verified Placement Data')}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="briefcase" size={30} color="#6200ea" />
            <Text style={styles.optionText}>Placement Data</Text>
          </Card.Content>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard} onPress={() => console.log('Advertise Section clicked')}>
          <Card.Content style={styles.optionContent}>
            <IconButton icon="bullhorn" size={30} color="#6200ea" />
            <Text style={styles.optionText}>Advertise Section</Text>
          </Card.Content>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Lighter background for a modern look
  },
  userCard: {
    marginBottom: 20,
    borderRadius: 20,
    elevation: 5,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileContainer: {
    marginBottom: 15,
    borderRadius: 100, // Circular container for image
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6200ea',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Circular image
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 18,
    color: '#555',
  },
  imageErrorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionContent: {
    alignItems: 'center',
    padding: 20,
  },
  optionText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});








//Old Logic and Style code 

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Card, IconButton } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function DashboardScreen() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const storedName = await AsyncStorage.getItem('name');
//         const storedEmail = await AsyncStorage.getItem('email');
//         console.log('Stored Name:', storedName); // Debug log
//         console.log('Stored Email:', storedEmail); // Debug log

//         if (storedName) setName(storedName);
//         if (storedEmail) setEmail(storedEmail);
//       } catch (error) {
//         console.error('Failed to fetch user data from AsyncStorage:', error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Handler functions for card clicks
//   const handleSearchCollege = () => {
//     console.log('Search College clicked');
//     // Navigate to the Search College screen or perform an action
//   };

//   const handleFindFuturePath = () => {
//     console.log('Find Future Path clicked');
//     // Navigate to the Find Future Path screen or perform an action
//   };

//   const handleGetBestCollege = () => {
//     console.log('Get Best College clicked');
//     // Navigate to the Get Best College screen or perform an action
//   };

//   const handleAdvertiseSection = () => {
//     console.log('Advertise Section clicked');
//     // Navigate to the Advertise Section screen or perform an action
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Card style={styles.userCard}>
//         <Card.Content style={styles.cardContent}>
//           <View style={styles.profileContainer}>
//             <IconButton
//               icon="account-circle"
//               size={100}  // Adjust size as needed
//               color="#3F51B5"
//             />
//           </View>
//           <View style={styles.textContainer}>
//             <Text style={styles.name}>{name || 'Name not available'}</Text>
//             <Text style={styles.email}>{email || 'Email not available'}</Text>
//           </View>
//         </Card.Content>
//       </Card>

//       <View style={styles.gridContainer}>
//         <TouchableOpacity style={styles.optionCard} onPress={handleSearchCollege}>
//           <Card.Content style={styles.optionContent}>
//             <IconButton icon="school" size={30} color="#3F51B5" />
//             <Text style={styles.optionText}>Search College</Text>
//           </Card.Content>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.optionCard} onPress={handleFindFuturePath}>
//           <Card.Content style={styles.optionContent}>
//             <IconButton icon="compass" size={30} color="#3F51B5" />
//             <Text style={styles.optionText}>Find Future Path</Text>
//           </Card.Content>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.optionCard} onPress={handleGetBestCollege}>
//           <Card.Content style={styles.optionContent}>
//             <IconButton icon="map-marker" size={30} color="#3F51B5" />
//             <Text style={styles.optionText}>Get Best College in Your Area</Text>
//           </Card.Content>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.optionCard} onPress={handleAdvertiseSection}>
//           <Card.Content style={styles.optionContent}>
//             <IconButton icon="bullhorn" size={30} color="#3F51B5" />
//             <Text style={styles.optionText}>Advertise Section</Text>
//           </Card.Content>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f4f7',
//   },
//   userCard: {
//     marginBottom: 20,
//     borderRadius: 12,
//     elevation: 4,
//     backgroundColor: '#ffffff',
//   },
//   cardContent: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: 15,
//   },
//   profileContainer: {
//     marginBottom: 15,
//   },
//   textContainer: {
//     alignItems: 'center',
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//     marginTop: 10,
//   },
//   email: {
//     fontSize: 16,
//     color: '#555',
//     marginTop: 5,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   optionCard: {
//     width: '48%',
//     marginBottom: 15,
//     borderRadius: 12,
//     backgroundColor: '#ffffff',
//     elevation: 4,
//   },
//   optionContent: {
//     alignItems: 'center',
//     padding: 15,
//   },
//   optionText: {
//     marginTop: 5,
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//   },
// });
