import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable, RefreshControl, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import network from '../network';
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
      const response = await axios.get(network.serverurl + "/Vendor/" + userData.VendorID);
    const Vendor = response.data;
    setVendorInfo(Vendor);
    }
   }catch (error){
      console.error('Error Fetching Vendor ID', error)
   }
  }


  const RiderData = async (userData) =>{
    try{
      if(userData.RiderID){
        const response = await axios.get(network.serverurl + "/Rider/" + userData.RiderID);
      const Rider = response.data;
      setRiderInfo(Rider);
    
     
      }
     }catch (error){
        console.error('Error Fetching Vendor ID', error)
     }
  }

  const handleLogout = async () => {
    try {
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
      style={{ flex: 1, backgroundColor: '#fff' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.menuText}>⋮</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={[styles.menuOption,{color:'red'}]}>Logout</Text>
              </TouchableOpacity>
              {
                profileData?<TouchableOpacity onPress={()=>{
                  setModalVisible(false)
                  navigation.navigate('EditCustomer',{customer: profileData})
                }}>
                <Text style={styles.menuOption}>Edit Profile Info</Text>
              </TouchableOpacity>:null
              }
              {
                RiderInfo?<TouchableOpacity onPress={()=>{
                  setModalVisible(false)
                  navigation.navigate('EditRider',{RiderID: RiderInfo.RiderID})
                }}>
                <Text style={styles.menuOption}>Edit Rider Info</Text>
              </TouchableOpacity>
                :<TouchableOpacity onPress={handleRegisterAsRider}>
                <Text style={styles.menuOption}>Register as Rider</Text>
              </TouchableOpacity>
              }
             {
              VendorInfo?<TouchableOpacity onPress={()=>{
                setModalVisible(false)
                navigation.navigate('EditVendor',{VendorID: VendorInfo.VendorID})
              }}>
              <Text style={styles.menuOption}>Edit Vendor Info</Text>
            </TouchableOpacity>
              : <TouchableOpacity onPress={handleRegisterAsVendor}>
              <Text style={styles.menuOption}>Register as Vendor</Text>
            </TouchableOpacity>
             }
            </View>
          </Pressable>
        </Modal>

        <View style={styles.header}>
          <Image source={{ uri: 'https://i.sstatic.net/l60Hf.png' }} style={styles.profileImage} />
          <Text style={styles.fullName}>{profileData ? profileData.FullName : 'Fetching Data'}</Text>
        </View>

        {profileData && (
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profileData.Email}</Text>

            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{profileData.Phone}</Text>

            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{profileData.Address}</Text>

            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{profileData.City}</Text>

            <Text style={styles.label}>Customer ID:</Text>
            <Text style={styles.value}>{profileData.CustomerID}</Text>
          </View>
        )}

        {VendorInfo && (
          <View style={[styles.profileInfo,{marginTop:30}]}>
            <Text style={styles.HeaderText}>Business Info</Text>
            <Text style={styles.label}>Business Name:</Text>
            <Text style={styles.value}>{VendorInfo.BusinessName}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{VendorInfo.Email}</Text>

            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{VendorInfo.CompanyAddress}</Text>

            <Text style={styles.label}>Market:</Text>
            <Text style={styles.value}>{VendorInfo.Market}</Text>

            <Text style={styles.label}>Shop Category:</Text>
            <Text style={styles.value}>{VendorInfo.ShopCategory}</Text>

            <Text style={styles.label}>Vendor ID:</Text>
            <Text style={styles.value}>{VendorInfo.VendorID}</Text>
          </View>
        )}

      {RiderInfo && (
          <View style={[styles.profileInfo,{marginTop:30}]}>
            <Text style={styles.HeaderText}>Rider Info</Text>
            

            <Text style={styles.label}>Bike Number:</Text>
            <Text style={styles.value}>{RiderInfo.BikeNumber}</Text>

            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{RiderInfo.Contact}</Text>

            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{RiderInfo.City}</Text>

            <Text style={styles.label}>Rider ID:</Text>
            <Text style={styles.value}>{RiderInfo.RiderID}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  menuText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuOption: {
    fontSize: 18,
    padding: 10,
  },
  HeaderText:{
    fontSize:20,
    fontWeight:'800',
    textAlign:'center',
    color:'semi-black',
    marginBottom:20
  }
});

export default ProfileScreen;
