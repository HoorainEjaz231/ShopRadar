import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { colors, radius, spacing, typography } from './theme';
import { Button } from './components/ui';
import VendorNavigation from './Navigations/VendorNav';
import CustomerNav from './Navigations/CustomerNav';
import RiderNavigation from './Navigations/RiderNav';
import OrderScreen from './CustomerScreens/Orders';
import ProfileScreen from './Navigations/ViewProfile';
const defaultAvatar = 'https://i.sstatic.net/l60Hf.png';
import VendorRegister from './VendorScreens/VendorRegister';
import RiderRegister from './RiderScreens/RiderRegister';
import AdminNavigation from './Navigations/AdminNav';
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
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <View style={styles.header}>
        {user ? (
          <TouchableOpacity style={styles.profilePill} onPress={handleLogout}>
            <Text style={styles.profilePillText}>Profile</Text>
          </TouchableOpacity>
        ) : null}
        <Avatar size="large" rounded source={{ uri: user?.ProfileImage || defaultAvatar }} />
        {user ? (
          <View style={styles.userInfo}>
            <Text style={[typography.sectionTitle, styles.name]}>{user?.FullName}</Text>
            <Text style={[typography.bodySm, styles.email]}>{user?.Email}</Text>
          </View>
        ) : (
          <Button title="Login" onPress={handleLogin} style={styles.loginButton} />
        )}
      </View>

      {/* Main Content Section */}
      <View style={styles.mainContent}>
        {props.currentMode === 'Customer' && (
          <Button title="Your Orders" onPress={() => navigation.navigate('Your Orders')} />
        )}
      </View>

      {/* Spacer to push buttons to the bottom */}
      <View style={{ flex: 1 }} />

      {/* Footer Section with Mode Buttons */}
      <View style={styles.footer}>
        {props.currentMode !== 'Customer' && (
          <Button
            variant="secondary"
            title="Customer Mode"
            onPress={() => navigateToMode('Customer', 'Customer Mode')}
            style={styles.modeButton}
          />
        )}
        {props.currentMode !== 'Vendor' && data?.VendorID !== null && (
          <Button
            variant="secondary"
            title="Vendor Mode"
            onPress={() => navigateToMode('Vendor', 'Vendor Mode')}
            style={styles.modeButton}
          />
        )}
        {props.currentMode !== 'Rider' && data?.RiderID !== null && (
          <Button
            variant="secondary"
            title="Rider Mode"
            onPress={() => navigateToMode('Rider', 'Rider Mode')}
            style={styles.modeButton}
          />
        )}
        {props.currentMode !== 'Admin' && data?.AdminUser === true && (
          <Button
            variant="secondary"
            title="Admin Mode"
            onPress={() => navigateToMode('Admin', 'Admin Mode')}
            style={styles.modeButton}
          />
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
  scrollContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: spacing.space5,
    backgroundColor: colors.backgroundFaf,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    position: 'relative',
  },
  userInfo: {
    marginTop: spacing.space3,
    alignItems: 'center',
  },
  profilePill: {
    position: 'absolute',
    top: spacing.space3,
    right: spacing.space3,
    backgroundColor: colors.primary,
    paddingVertical: spacing.space1,
    paddingHorizontal: spacing.space3,
    borderRadius: radius.pill,
  },
  profilePillText: {
    ...typography.chip,
    color: colors.white,
  },
  name: {
    color: colors.textPrimary,
  },
  email: {
    color: colors.textGray,
  },
  loginButton: {
    marginTop: spacing.space4,
    alignSelf: 'stretch',
  },
  mainContent: {
    padding: spacing.space4,
  },
  footer: {
    paddingHorizontal: spacing.space4,
    paddingBottom: spacing.space6,
  },
  modeButton: {
    marginTop: spacing.space3,
  },
});