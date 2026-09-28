import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable, RefreshControl, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { vendorsApi, ridersApi } from '../lib/api';
import * as Icon from 'react-native-feather';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { Card, IconContainer } from '../components/ui';
const ProfileScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [VendorInfo, setVendorInfo] = useState(false);
  const [RiderInfo, setRiderInfo] = useState(false);

  useEffect(() => {
    fetchCustomerID();
  }, []); // Only run once on mount

  const fetchCustomerID = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setProfileData(JSON.parse(userData));
        VendorData(JSON.parse(userData));
        RiderData(JSON.parse(userData))
      }


    } catch (error) {
      console.error('Error fetching customer ID', error);
    }
  };

  const VendorData = async(userData) => {
   try{
    if(userData.VendorID){
      const Vendor = await vendorsApi.getVendorById(userData.VendorID);
      setVendorInfo(Vendor);
    }
   }catch (error){
      console.error('Error Fetching Vendor ID', error)
   }
  }


  const RiderData = async (userData) =>{
    try{
      if(userData.RiderID){
        const Rider = await ridersApi.getRiderById(userData.RiderID);
        setRiderInfo(Rider);
      }
     }catch (error){
        console.error('Error Fetching Vendor ID', error)
     }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const handleRegisterAsRider = () => {
    navigation.navigate('RiderRegister', {
      CustomerID: profileData.CustomerID
    });
  };

  const handleRegisterAsVendor = () => {
    navigation.navigate('VendorRegister', {
      CustomerID: profileData.CustomerID
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomerID().finally(() => setRefreshing(false));
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <IconContainer variant="header" onPress={() => setModalVisible(true)} style={styles.menuButton}>
          <Icon.MoreVertical width={20} height={20} stroke={colors.textPrimary} />
        </IconContainer>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={[typography.body, styles.menuOption, styles.menuOptionDanger]}>Logout</Text>
              </TouchableOpacity>
              {
                profileData?<TouchableOpacity onPress={()=>{
                  setModalVisible(false)
                  navigation.navigate('EditCustomer',{customer: profileData})
                }}>
                <Text style={[typography.body, styles.menuOption]}>Edit Profile Info</Text>
              </TouchableOpacity>:null
              }
              {
                RiderInfo?<TouchableOpacity onPress={()=>{
                  setModalVisible(false)
                  navigation.navigate('EditRider',{RiderID: RiderInfo.RiderID})
                }}>
                <Text style={[typography.body, styles.menuOption]}>Edit Rider Info</Text>
              </TouchableOpacity>
                :<TouchableOpacity onPress={handleRegisterAsRider}>
                <Text style={[typography.body, styles.menuOption]}>Register as Rider</Text>
              </TouchableOpacity>
              }
             {
              VendorInfo?<TouchableOpacity onPress={()=>{
                setModalVisible(false)
                navigation.navigate('EditVendor',{VendorID: VendorInfo.VendorID})
              }}>
              <Text style={[typography.body, styles.menuOption]}>Edit Vendor Info</Text>
            </TouchableOpacity>
              : <TouchableOpacity onPress={handleRegisterAsVendor}>
              <Text style={[typography.body, styles.menuOption]}>Register as Vendor</Text>
            </TouchableOpacity>
             }
            </View>
          </Pressable>
        </Modal>

        <View style={styles.header}>
          <Image source={{ uri: 'https://i.sstatic.net/l60Hf.png' }} style={styles.profileImage} />
          <Text style={[typography.display, styles.fullName]}>{profileData ? profileData.FullName : 'Fetching Data'}</Text>
        </View>

        {profileData && (
          <Card style={styles.profileInfo}>
            <Text style={[typography.label, styles.label]}>Email:</Text>
            <Text style={[typography.body, styles.value]}>{profileData.Email}</Text>

            <Text style={[typography.label, styles.label]}>Phone:</Text>
            <Text style={[typography.body, styles.value]}>{profileData.Phone}</Text>

            <Text style={[typography.label, styles.label]}>Address:</Text>
            <Text style={[typography.body, styles.value]}>{profileData.Address}</Text>

            <Text style={[typography.label, styles.label]}>City:</Text>
            <Text style={[typography.body, styles.value]}>{profileData.City}</Text>

            <Text style={[typography.label, styles.label]}>Customer ID:</Text>
            <Text style={[typography.body, styles.value]}>{profileData.CustomerID}</Text>
          </Card>
        )}

        {VendorInfo && (
          <Card style={[styles.profileInfo, styles.sectionSpacing]}>
            <Text style={[typography.sectionTitle, styles.headerText]}>Business Info</Text>
            <Text style={[typography.label, styles.label]}>Business Name:</Text>
            <Text style={[typography.body, styles.value]}>{VendorInfo.BusinessName}</Text>

            <Text style={[typography.label, styles.label]}>Email:</Text>
            <Text style={[typography.body, styles.value]}>{VendorInfo.Email}</Text>

            <Text style={[typography.label, styles.label]}>Address:</Text>
            <Text style={[typography.body, styles.value]}>{VendorInfo.CompanyAddress}</Text>

            <Text style={[typography.label, styles.label]}>Market:</Text>
            <Text style={[typography.body, styles.value]}>{VendorInfo.Market}</Text>

            <Text style={[typography.label, styles.label]}>Shop Category:</Text>
            <Text style={[typography.body, styles.value]}>{VendorInfo.ShopCategory}</Text>

            <Text style={[typography.label, styles.label]}>Vendor ID:</Text>
            <Text style={[typography.body, styles.value]}>{VendorInfo.VendorID}</Text>
          </Card>
        )}

      {RiderInfo && (
          <Card style={[styles.profileInfo, styles.sectionSpacing]}>
            <Text style={[typography.sectionTitle, styles.headerText]}>Rider Info</Text>


            <Text style={[typography.label, styles.label]}>Bike Number:</Text>
            <Text style={[typography.body, styles.value]}>{RiderInfo.BikeNumber}</Text>

            <Text style={[typography.label, styles.label]}>Contact:</Text>
            <Text style={[typography.body, styles.value]}>{RiderInfo.Contact}</Text>

            <Text style={[typography.label, styles.label]}>City:</Text>
            <Text style={[typography.body, styles.value]}>{RiderInfo.City}</Text>

            <Text style={[typography.label, styles.label]}>Rider ID:</Text>
            <Text style={[typography.body, styles.value]}>{RiderInfo.RiderID}</Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.space8,
  },
  container: {
    flex: 1,
    padding: spacing.space5,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.space5,
    marginTop: spacing.space5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    marginBottom: spacing.space3,
    borderWidth: 1,
    borderColor: colors.white,
  },
  fullName: {
    color: colors.textPrimary,
  },
  profileInfo: {},
  label: {
    color: colors.textGray,
    marginBottom: spacing.space1,
  },
  value: {
    color: colors.textPrimary,
    marginBottom: spacing.space3,
  },
  sectionSpacing: {
    marginTop: spacing.space6,
  },
  menuButton: {
    position: 'absolute',
    top: spacing.space3,
    right: spacing.space3,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.space5,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  menuOption: {
    padding: spacing.space3,
    color: colors.textPrimary,
  },
  menuOptionDanger: {
    color: colors.danger,
  },
  headerText:{
    textAlign:'center',
    color: colors.textPrimary,
    marginBottom: spacing.space5,
  }
});

export default ProfileScreen;
