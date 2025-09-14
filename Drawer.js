import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import VendorNavigation from './Navigations/VendorNav';
import CustomerNav from './Navigations/CustomerNav';
import RiderNavigation from './Navigations/RiderNav';
import OrderScreen from './CustomerScreens/Orders';
import ProfileScreen from './Navigations/ViewProfile';
const defaultAvatar = 'https://i.sstatic.net/l60Hf.png';
import VendorRegister from './VendorScreens/VendorRegister';
import RiderRegister from './RiderScreens/RiderRegister';
import AdminNavigation from '../Shop-Radar/Navigations/AdminNav';
import EditRider from './EDITComponent/EditRider';
import EditVendor from './EDITComponent/EditVendor';
import EditCustomer from './EDITComponent/EditCustomer';

function CustomDrawerContent(props) {
  const nav = useNavigation();
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await AsyncStorage.getItem('user');
      const parsedData = JSON.parse(userData);
      console.log("parse data", parsedData);
      setUser(parsedData);
      setData(parsedData);
    };

    fetchData();
  }, []);

  const navigateToMode = (mode, screen) => {
    props.setCurrentMode(mode);
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    nav.navigate('View Profile');
  };

  const handleLogin = () => {
    nav.navigate('Login');
  };

  if (!data) {
    return null;
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        {user ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Profile</Text>
          </TouchableOpacity>
        ) : null}
        <Avatar size="large" rounded source={{ uri: user?.ProfileImage || defaultAvatar }} />
        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user?.FullName}</Text>
            <Text style={styles.email}>{user?.Email}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content Section */}
      <View style={styles.mainContent}>
        {props.currentMode === 'Customer' && (
          <TouchableOpacity style={styles.ordersButton} onPress={() => navigation.navigate('Your Orders')}>
            <Text style={styles.ordersButtonText}>Your Orders</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Spacer to push buttons to the bottom */}
      <View style={{ flex: 1 }} />

      {/* Footer Section with Mode Buttons */}
      <View style={styles.footer}>
        {props.currentMode !== 'Customer' && (
          <TouchableOpacity style={styles.modeButton} onPress={() => navigateToMode('Customer', 'Customer Mode')}>
            <Text style={styles.buttonText}>Customer Mode</Text>
          </TouchableOpacity>
        )}
        {props.currentMode !== 'Vendor' && data?.VendorID !== null && (
          <TouchableOpacity style={styles.modeButton} onPress={() => navigateToMode('Vendor', 'Vendor Mode')}>
            <Text style={styles.buttonText}>Vendor Mode</Text>
          </TouchableOpacity>
        )}
        {props.currentMode !== 'Rider' && data?.RiderID !== null && (
          <TouchableOpacity style={styles.modeButton} onPress={() => navigateToMode('Rider', 'Rider Mode')}>
            <Text style={styles.buttonText}>Rider Mode</Text>
          </TouchableOpacity>
        )}
        {props.currentMode !== 'Admin' && data?.AdminUser === true && (
          <TouchableOpacity style={styles.modeButton} onPress={() => navigateToMode('Admin', 'Admin Mode')}>
            <Text style={styles.buttonText}>Admin Mode</Text>
          </TouchableOpacity>
        )}
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNav() {
  const Drawer = createDrawerNavigator();
  const [currentMode, setCurrentMode] = useState('Customer');

  return (
    <Drawer.Navigator
      drawerContent={props => (
        <CustomDrawerContent {...props} currentMode={currentMode} setCurrentMode={setCurrentMode} />
      )}
      screenOptions={{
        headerShown: false,
        drawerLabel: () => null,
        drawerIcon: () => null,
      }}
    >
      <Drawer.Screen name="Customer Mode">
        {props => <CustomerNav {...props} onModeChange={() => setCurrentMode('Customer')} />}
      </Drawer.Screen>
      <Drawer.Screen name="Vendor Mode">
        {props => <VendorNavigation {...props} onModeChange={() => setCurrentMode('Vendor')} />}
      </Drawer.Screen>
      <Drawer.Screen name="Rider Mode">
        {props => <RiderNavigation {...props} onModeChange={() => setCurrentMode('Rider')} />}
      </Drawer.Screen>
      {currentMode === 'Customer' && (
        <Drawer.Screen name="Your Orders" component={OrderScreen} />
      )}
      <Drawer.Screen name='View Profile' component={ProfileScreen} />
      <Drawer.Screen name='VendorRegister' component={VendorRegister} />
      <Drawer.Screen name='RiderRegister' component={RiderRegister} />
      <Drawer.Screen name='EditRider' component={EditRider} />
      <Drawer.Screen name='EditVendor' component={EditVendor} />
      <Drawer.Screen name='EditCustomer' component={EditCustomer} />
    
      <Drawer.Screen name="Admin Mode">
        {props => <AdminNavigation {...props} onModeChange={() => setCurrentMode('Admin')} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'relative',
    
  },
  userInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f39c12',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  loginButton: {
    marginTop: 15,
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    padding: 10,
  },
  ordersButton: {
    backgroundColor: '#f39c12',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ordersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  modeButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});