import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { themeColors } from '../theme'; // Assuming you have themeColors for consistent styling
import network from '../network';

const EditCustomer = ({ route, navigation }) => {
  const { customer } = route.params; // Fetch the customer data from route params

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [country, setCountry] = useState('');

  const [vendorName, setVendorName] = useState('');
  const [vendorMarket, setVendorMarket] = useState('');
  const [riderName, setRiderName] = useState('');
  const [riderBikeNumber, setRiderBikeNumber] = useState('');

  // Initialize form fields with customer data when component mounts
  useEffect(() => {
    if (customer) {
      setFullName(customer.FullName || '');
      setEmail(customer.Email || '');
      setPhone(customer.Phone || '');
      setAddress(customer.Address || '');
      setCity(customer.City || '');
      setStateProvince(customer.StateProvince || '');
      setCountry(customer.Country || '');

     
    }
  }, [customer]);

  // Save updated customer details
  const saveCustomer = async () => {
    try {
      const updatedCustomer = {
        FullName: fullName,
        Email: email,
        Phone: phone,
        Address: address,
        City: city,
        StateProvince: stateProvince,
        Country: country,
      
      };

      // Send updated data to backend
      await axios.put(`${network.serverurl}/Customer/update/${customer.CustomerID}`, updatedCustomer);

      Alert.alert('Success', 'Customer updated successfully');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Failed to update customer:', error);
      Alert.alert('Error', 'Failed to update customer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Customer</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="State/Province"
        value={stateProvince}
        onChangeText={setStateProvince}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveCustomer}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditCustomer;

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
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.primary,
    marginVertical: 10,
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
});
