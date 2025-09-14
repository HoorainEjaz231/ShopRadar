import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { themeColors } from '../theme'; // Assuming you have themeColors for consistent styling
import network from '../network';

const EditRider = ({ route, navigation }) => {
  const { RiderID } = route.params; // Get RiderID from params
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: '',
    IDCardNumber: '',
    City: '',
    BikeNumber: '',
   
   
    
    Contact: '',
  });

  // Fetch rider details on mount
  useEffect(() => {
    const fetchRiderDetails = async () => {
      try {
        const response = await axios.get(`${network.serverurl}/Rider/${RiderID}`);
        const riderData = response.data;
        setRider(riderData);
        setFormData({
          Name: riderData.Name,
          IDCardNumber: riderData.IDCardNumber,
          City: riderData.City,
          BikeNumber: riderData.BikeNumber,
          
         
          
          Contact: riderData.Contact,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rider details:', error);
        setLoading(false);
      }
    };

    fetchRiderDetails();
  }, [RiderID]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Save updated rider details
  const saveRiderDetails = async () => {
    try {
      await axios.put(`${network.serverurl}/Rider/update/${RiderID}`, formData);
      Alert.alert('Success', 'Rider details updated successfully');
      navigation.goBack(); // Go back after saving
    } catch (error) {
      console.error('Error updating rider details:', error);
      Alert.alert('Error', 'Failed to update rider details');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading rider details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Rider Details</Text>

      <TextInput
        style={styles.input}
        value={formData.Name}
        onChangeText={(value) => handleInputChange('Name', value)}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={formData.IDCardNumber}
        onChangeText={(value) => handleInputChange('IDCardNumber', value)}
        placeholder="ID Card Number"
      />
      <TextInput
        style={styles.input}
        value={formData.City}
        onChangeText={(value) => handleInputChange('City', value)}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        value={formData.BikeNumber}
        onChangeText={(value) => handleInputChange('BikeNumber', value)}
        placeholder="Bike Number"
      />
      <TextInput
        style={styles.input}
        value={formData.Contact}
        onChangeText={(value) => handleInputChange('Contact', value)}
        placeholder="Contact Number"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveRiderDetails}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditRider;

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
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: themeColors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
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
