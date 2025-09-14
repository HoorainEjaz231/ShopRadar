import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { themeColors } from '../theme'; // Assuming you have themeColors for consistent styling
import network from '../network';

const EditVendor = ({ route, navigation }) => {
  const { VendorID } = route.params; // Fetch the VendorID from route params

  const [VendorBusinessName, setVendorBusinessName] = useState('');
  const [market, setMarket] = useState('');
  const [CompanyAddress, setCompanyAddress] = useState('');
  const [City, setCity] = useState('');

  const [Contact, setContact] = useState('');
  const [Email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vendor details based on VendorID
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(`${network.serverurl}/vendor/${VendorID}`);
        const vendor = response.data;

        // Set vendor details into state
        setVendorBusinessName(vendor.BusinessName || '');
        setMarket(vendor.Market || '');
        setCompanyAddress(vendor.CompanyAddress || '')
        setCity(vendor.City || '')
        setContact(vendor.Contact || '')
        setEmail(vendor.Email || '')
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch vendor details:', error);
        Alert.alert('Error', 'Failed to fetch vendor details');
        setIsLoading(false);
      }
    };

    if (VendorID) {
      fetchVendorDetails();
    }
  }, [VendorID]);

  // Save updated vendor details
  const saveVendorDetails = async () => {
    try {
      const updatedVendor = {
        BusinessName: VendorBusinessName,
        Market: market,
        City: City,
        CompanyAddress: CompanyAddress,
        Contact: Contact,
        Email: Email
      };

      // Send updated data to backend
      await axios.put(`${network.serverurl}/vendor/update/${VendorID}`, updatedVendor);

      Alert.alert('Success', 'Vendor updated successfully');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Failed to update vendor:', error);
      Alert.alert('Error', 'Failed to update vendor');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Vendor</Text>

      <TextInput
        style={styles.input}
        placeholder="Vendor Name"
        value={VendorBusinessName}
        onChangeText={setVendorBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Market"
        value={market}
        onChangeText={setMarket}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={Email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={Contact}
        onChangeText={setContact}
      />
      <TextInput
        style={styles.input}
        placeholder="Company Address"
        value={CompanyAddress}
        onChangeText={setCompanyAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={City}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveVendorDetails}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditVendor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: themeColors.bgColor(0.1),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: themeColors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: themeColors.text,
  },
});
