
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { Provider as PaperProvider } from 'react-native-paper';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// // Importing screens from student directory
// import DashboardScreen from './student/DashboardScreen';
// import EnterDetailsScreen from './student/EnterDetailsScreen';
// import ChatBotScreen from './student/ChatBotScreen';
// import UserDetailsScreen from './student/UserDetailsScreen';
// import PlacementDataScreen from './student/PlacementDataScreen';
// import LogoutScreen from './student/LogoutScreen';
// import ApprovedPlacementDataScreen from './student/ApprovedPlacementDataScreen';
// import CollegeLocatorScreen from './student/CollegeLocatorScreen';
// import ChatBotScreen1 from './student/ChatBotScreen1';
// import CalculateRank from './student/CalculateRank';



// // Importing screens from auth directory
// import LoginScreen from './auth/LoginScreen';
// import RegistrationScreen from './auth/RegistrationScreen';

// // Importing the Admin screens
// import AdminScreen from './admin/AdminScreen';
// import EnterPlacementDataScreen from './admin/EnterPlacementDataScreen';
// import PlacementDataCollectionScreen from './admin/PlacementDataCollectionScreen';
// import PlacementDataApproveScreen from './admin/PlacementDataApproveScreen'; // Import the approve screen
// import CollegeAdminForm from './admin/CollegeAdminForm';
// import AdvertiseCollege from './admin/AdvertiseCollege';  
// import StudentDetail from './admin/StudentDetails';
// import CollegeAdminScreen from './admin/CollegeAdminScreen';
// import AdminCollegeDataScren from './admin/AdminCollegeDataScren';




// import BuyStudentData from './Extras/BuyStudentData';

// const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();

// const CustomDrawerContent = (props) => {
//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('userType');
//     props.navigation.navigate('Login');
//   };

//   return (
//     <ScrollView style={styles.drawerContent}>
//       <View style={styles.drawerHeader}>
//         <Image
//           source={{ uri: 'https://example.com/your-avatar.png' }} // Replace with actual avatar URL
//           style={styles.avatar}
//         />
//         <Text style={styles.username}>Hello, User</Text>
//       </View>
//       <View style={styles.drawerItems}>
//         {props.state.routeNames.map((routeName, index) => {
//           let iconName;
//           switch (routeName) {
//             case 'Student Dashboard':
//               iconName = 'view-dashboard';
//               break;
//             case 'Personal Details':
//               iconName = 'account-details';
//               break;
//             case 'Recommendations':
//               iconName = 'chart-timeline-variant-shimmer';
//               break;
              
//               case 'Recommendations 2':
//                 iconName = 'chart-timeline-variant-shimmer';
//                 break;
//             case 'User Details':
//               iconName = 'account';
//               break;
//               case 'College Data':
//                 iconName = 'database';
//                 break;
//             case 'Placement Data':
//               iconName = 'briefcase';
//               break;
//               case 'Predict Your Rank':
//                 iconName = 'star';
//                 break;
//             case 'Verified Placement Data':
//               iconName = 'check-circle';
//               break;
//             case 'College Dashboard':
//               iconName = 'home';
//               break;
//             case 'Placement Dashboard':
//               iconName = 'file-upload';
//               break;
//             case 'Placement Data Collection':
//               iconName = 'database';
//               break;
//             case 'Buy Student Data':
//               iconName = 'shopping';
//               break;
//               case 'Advertise college':
//                 iconName = 'advertisements';
//                 break;
//             case 'Placement Data Approval':
//               iconName = 'check-circle-outline';
//               break;
//               case 'College Details':
//                 iconName = 'account-details';
//                 break;
//                 case 'Locate College':
//                   iconName = 'longitude';
//                   break;
                
//             default:
//               iconName = 'circle';
//           }
//           return (
//             <TouchableOpacity
//               key={routeName}
//               style={styles.drawerItem}
//               onPress={() => props.navigation.navigate(routeName)}
//             >
//               <Icon name={iconName} size={24} color="#333" />
//               <Text style={styles.drawerItemText}>{routeName}</Text>
//             </TouchableOpacity>
//           );
//         })}
//         <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
//           <Icon name="logout" size={24} color="#333" />
//           <Text style={styles.drawerItemText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// function StudentDrawer() {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerStyle: { backgroundColor: '#553d5f' }, // Light purple header
//         headerTintColor: '#fff',
//         drawerStyle: { backgroundColor: '#f5f5f5' },
//         drawerActiveTintColor: '#6200ea',
//         drawerInactiveTintColor: '#333',
//       }}
//     >
//       <Drawer.Screen name="Student Dashboard" component={DashboardScreen} />
//       <Drawer.Screen name="Personal Details" component={EnterDetailsScreen} />
//       <Drawer.Screen name="Recommendations" component={ChatBotScreen} />
//       <Drawer.Screen name="Recommendations 2" component={ChatBotScreen1} />
//       <Drawer.Screen name="Predict Your Rank" component={CalculateRank} />
//       <Drawer.Screen name="User Details" component={UserDetailsScreen} />
//       <Drawer.Screen name="Placement Data" component={PlacementDataScreen} />
//       <Drawer.Screen name="Verified Placement Data" component={ApprovedPlacementDataScreen} />
  
//       <Drawer.Screen name="Locate College" component={CollegeLocatorScreen} />
//     </Drawer.Navigator>
//   );
// }

// function AdminDrawer() {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerStyle: { backgroundColor: '#553d5f' }, // Light purple header
//         headerTintColor: '#fff',
//         drawerStyle: { backgroundColor: '#f5f5f5' },
//         drawerActiveTintColor: '#6200ea',
//         drawerInactiveTintColor: '#333',
//       }}
//     >
//       <Drawer.Screen name="College Dashboard" component={AdminScreen} />
//       <Drawer.Screen name="Placement Dashboard" component={EnterPlacementDataScreen} />
//       <Drawer.Screen name="Placement Data Collection" component={PlacementDataCollectionScreen} />
//       <Drawer.Screen name="Buy Student Data" component={BuyStudentData} />
//       <Drawer.Screen name="Placement Data Approval" component={PlacementDataApproveScreen} />
//       <Drawer.Screen name="College Details" component={CollegeAdminForm} />
//       <Drawer.Screen name="Advertise college" component={AdvertiseCollege} />
//       <Drawer.Screen name="College Data" component={AdminCollegeDataScren} />
      
      
//     </Drawer.Navigator>
//   );
// }

// function MainStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="Register" component={RegistrationScreen} />
//       <Stack.Screen name="StudentDrawer" component={StudentDrawer} options={{ headerShown: false }} />
//       <Stack.Screen name="AdminDrawer" component={AdminDrawer} options={{ headerShown: false }} />
//       <Stack.Screen name="Admin Screen" component={CollegeAdminScreen} options={{ headerShown: true }} />
//       <Stack.Screen name="CollegeAdminScreen" component={CollegeAdminScreen} options={{ headerShown: false }} />
     
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const type = await AsyncStorage.getItem('userType');

//         if (token && type) {
//           setAuthenticated(true);
//           setUserType(type);
//         } else {
//           setAuthenticated(false);
//           setUserType(null);
//         }
//       } catch (error) {
//         console.error('Error checking authentication:', error);
//         setAuthenticated(false);
//         setUserType(null);
//       }
//     };

//     checkAuthentication();
//   }, []);

//   return (
//     <PaperProvider>
//       <NavigationContainer>
//         {authenticated ? (
//           userType === 'admin' ? (
//             <AdminDrawer />
//           ) : (
//             <StudentDrawer />
//           )
//         ) : (
//           <MainStack />
//         )}
//       </NavigationContainer>
//     </PaperProvider>
//   );
// }

// const styles = StyleSheet.create({
//   drawerContent: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   drawerHeader: {
//     padding: 20,
//     backgroundColor: '#7a5f8b', // Light purple background
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   username: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   drawerItems: {
//     flex: 1,
//     marginTop: 20,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   drawerItemText: {
//     marginLeft: 15,
//     fontSize: 16,
//     color: '#333',
//   },
// });
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // React Native Web supports it via polyfills
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Compatible with React Native Web

// Importing screens from auth directory
import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegistrationScreen';

// Importing the Admin screen
import AdminScreen from './admin/AdminScreen';

// Importing the Student Dashboard screen
import DashboardScreen from './student/DashboardScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Custom Drawer Content component for both admin and student
const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userType');
    props.navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Image
          source={{ uri: 'https://example.com/your-avatar.png' }} // Replace with actual avatar URL
          style={styles.avatar}
        />
        <Text style={styles.username}>Hello, User</Text>
      </View>
      <View style={styles.drawerItems}>
        {props.state.routeNames.map((routeName, index) => {
          let iconName;
          switch (routeName) {
            case 'Student Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Admin Dashboard':
              iconName = 'home';
              break;
            default:
              iconName = 'circle';
          }
          return (
            <TouchableOpacity
              key={routeName}
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate(routeName)}
            >
              <Icon name={iconName} size={24} color="#333" />
              <Text style={styles.drawerItemText}>{routeName}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Simplified Student Drawer
function StudentDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#553d5f' }, // Light purple header
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#f5f5f5' },
        drawerActiveTintColor: '#6200ea',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen name="Student Dashboard" component={DashboardScreen} />
    </Drawer.Navigator>
  );
}

// Simplified Admin Drawer
function AdminDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#553d5f' }, // Light purple header
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#f5f5f5' },
        drawerActiveTintColor: '#6200ea',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen name="Admin Dashboard" component={AdminScreen} />
    </Drawer.Navigator>
  );
}

// Main Stack Navigator with only Login and Registration
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App component
export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const type = await AsyncStorage.getItem('userType');

        if (token && type) {
          setAuthenticated(true);
          setUserType(type);
        } else {
          setAuthenticated(false);
          setUserType(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthenticated(false);
        setUserType(null);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        {authenticated ? (
          userType === 'admin' ? (
            <AdminDrawer />
          ) : (
            <StudentDrawer />
          )
        ) : (
          <MainStack />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

// Styles for the drawer
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: '#7a5f8b', // Light purple background
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerItems: {
    flex: 1,
    marginTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});
