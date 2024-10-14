// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
// import axios from 'axios';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import config from '../config';

// export default function PlacementDataScreen() {
//   const [collegeName, setCollegeName] = useState('');
//   const [year, setYear] = useState('');
//   const [filename, setFilename] = useState('');
//   const [placements, setPlacements] = useState([]);

//   const fetchPlacements = async () => {
//     if (!collegeName || !year) {
//       Alert.alert('Error', 'Please enter both college name and year');
//       return;
//     }

//     try {
//       const response = await axios.get(`${config.SERVER_IP}:5004/placements`, { // Replace with your actual IP address
//         params: {
//           collegeName,
//           year,
//         },
//       });
//       setPlacements(response.data);
//     } catch (error) {
//       console.error('Error fetching placements:', error);
//       Alert.alert('Error', `Failed to fetch placement data: ${error.message}`);
//     }
//   };

//   const downloadAndOpenFile = async (filePath) => {
//     if (!filePath) {
//       Alert.alert('Error', 'Please provide a file path');
//       return;
//     }
  
//     const documentDirectory = FileSystem.documentDirectory;
//     const sanitizedFileName = filePath.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, ''); // Extract and sanitize filename
//     const fileUri = `${documentDirectory}${Date.now()}_${sanitizedFileName}`;
  
//     try {
//       // Construct the correct URL
//       const fileUrl = `${config.SERVER_IP}:5004/uploads/${filePath.replace(/\\/g, '/')}`; // Replace with your actual IP address
//       console.log('Attempting to download file from:', fileUrl);
//       console.log('Saving file to:', fileUri);
  
//       // Download the file to the document directory
//       const { uri, status } = await FileSystem.downloadAsync(fileUrl, fileUri);
  
//       // Log download status
//       console.log('Download status:', status);
//       console.log('File downloaded to:', uri);
  
//       // Check file size to ensure it is not empty
//       const fileInfo = await FileSystem.getInfoAsync(uri);
//       console.log('File info:', fileInfo);
  
//       if (fileInfo.size > 0) {
//         // Check if sharing is available
//         if (await Sharing.isAvailableAsync()) {
//           try {
//             await Sharing.shareAsync(uri);
//           } catch (shareError) {
//             console.error('Error sharing file:', shareError);
//             Alert.alert('Error', `Failed to share the file: ${shareError.message}`);
//           }
//         } else {
//           Alert.alert('Sharing not available', 'Your device does not support sharing files.');
//         }
//       } else {
//         Alert.alert('Error', 'Downloaded file is empty or not valid.');
//       }
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       Alert.alert('Error', `Failed to download or open the file: ${error.message}`);
//     }
//   };
  
  
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>View Placement Data</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="College Name"
//         value={collegeName}
//         onChangeText={setCollegeName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Year"
//         keyboardType="numeric"
//         value={year}
//         onChangeText={setYear}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Filename (e.g., report.pdf)"
//         value={filename}
//         onChangeText={setFilename}
//       />
//       <Button title="Fetch Placements" onPress={fetchPlacements} />
//       <FlatList
//         data={placements}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => downloadAndOpenFile(item.filePath)}>
//             <Text style={styles.itemText}>{item.collegeName} - {item.year}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f4f7',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff',
//   },
//   itemText: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
// });

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import config from '../config';

export default function PlacementDataScreen() {
  const [collegeName, setCollegeName] = useState('');
  const [year, setYear] = useState('');
  const [filename, setFilename] = useState('');
  const [placements, setPlacements] = useState([]);

  const fetchPlacements = async () => {
    if (!collegeName || !year) {
      Alert.alert('Error', 'Please enter both college name and year.');
      return;
    }

    try {
      const response = await axios.get(`${config.SERVER_IP}:5004/placements`, {
        params: { collegeName, year },
      });

      if (response.data && response.data.length > 0) {
        setPlacements(response.data);
      } else {
        setPlacements([]);
        Alert.alert('No Data', 'No placement data found for the specified college and year.');
      }
    } catch (error) {
      console.error('Error fetching placements:', error);
      Alert.alert('Error', `Failed to fetch placement data: ${error.message}`);
    }
  };

  const downloadAndOpenFile = async (filePath) => {
    if (!filePath) {
      Alert.alert('Error', 'File path not available.');
      return;
    }
  
    const sanitizedFileName = filePath.split('/').pop();
    const fileUri = `${FileSystem.documentDirectory}${sanitizedFileName}`;
  
    try {
      const fileUrl = `${config.SERVER_IP}:5004/uploads/${sanitizedFileName}`;
      console.log('Downloading file from:', fileUrl);
  
      const { uri, status } = await FileSystem.downloadAsync(fileUrl, fileUri);
      console.log('Download status:', status);
  
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.size > 0 && status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Sharing not available', 'Your device does not support sharing files.');
        }
      } else {
        Alert.alert('Error', 'Downloaded file is empty or invalid.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', `Failed to download or open the file: ${error.message}`);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Placement Data</Text>
      <TextInput
        style={styles.input}
        placeholder="College Name"
        value={collegeName}
        onChangeText={setCollegeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        style={styles.input}
        placeholder="Filename (Optional)"
        value={filename}
        onChangeText={setFilename}
      />
      <Button title="Fetch Placements" onPress={fetchPlacements} />

      {placements.length > 0 ? (
        <FlatList
          data={placements}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.placementItem}
              onPress={() => downloadAndOpenFile(item.filePath)}
            >
              <Text style={styles.itemText}>
                {item.collegeName} - {item.year}
              </Text>
              <Text style={styles.downloadText}>Download PDF</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No placement data available.</Text>
      )}
    </View>
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  placementItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
  },
  downloadText: {
    fontSize: 16,
    color: '#3F51B5',
  },
  noDataText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
  },
});



