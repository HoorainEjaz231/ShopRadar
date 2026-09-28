import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { ridersApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Card, Button, ModalAlert } from '../components/ui';

const EditRider = ({ route, navigation }) => {
  const { RiderID } = route.params; // Get RiderID from params
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', onConfirm: null });
  const [formData, setFormData] = useState({
    Name: '',
    IDCardNumber: '',
    City: '',
    BikeNumber: '',



    Contact: '',
  });

  const closeAlert = () => setAlert((a) => ({ ...a, visible: false }));

  // Fetch rider details on mount
  useEffect(() => {
    const fetchRiderDetails = async () => {
      try {
        const riderData = await ridersApi.getRiderById(RiderID);
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
      await ridersApi.updateRider(RiderID, formData);
      setAlert({
        visible: true,
        title: 'Success',
        message: 'Rider details updated successfully',
        onConfirm: () => {
          closeAlert();
          navigation.goBack();
        },
      });
    } catch (error) {
      console.error('Error updating rider details:', error);
      setAlert({ visible: true, title: 'Error', message: 'Failed to update rider details', onConfirm: closeAlert });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, styles.loadingText]}>Loading rider details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[typography.display, styles.title]}>Edit Rider Details</Text>

      <Card style={styles.formCard}>
        <TextInput
          style={[typography.body, styles.input]}
          value={formData.Name}
          onChangeText={(value) => handleInputChange('Name', value)}
          placeholder="Name"
          placeholderTextColor={colors.textGray}
        />
        <TextInput
          style={[typography.body, styles.input]}
          value={formData.IDCardNumber}
          onChangeText={(value) => handleInputChange('IDCardNumber', value)}
          placeholder="ID Card Number"
          placeholderTextColor={colors.textGray}
        />
        <TextInput
          style={[typography.body, styles.input]}
          value={formData.City}
          onChangeText={(value) => handleInputChange('City', value)}
          placeholder="City"
          placeholderTextColor={colors.textGray}
        />
        <TextInput
          style={[typography.body, styles.input]}
          value={formData.BikeNumber}
          onChangeText={(value) => handleInputChange('BikeNumber', value)}
          placeholder="Bike Number"
          placeholderTextColor={colors.textGray}
        />
        <TextInput
          style={[typography.body, styles.input]}
          value={formData.Contact}
          onChangeText={(value) => handleInputChange('Contact', value)}
          placeholder="Contact Number"
          placeholderTextColor={colors.textGray}
        />

        <Button title="Save" onPress={saveRiderDetails} style={styles.button} />
      </Card>

      <ModalAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        confirmLabel="OK"
        onConfirm={alert.onConfirm}
        onRequestClose={closeAlert}
      />
    </ScrollView>
  );
};

export default EditRider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.space5,
    paddingTop: spacing.space8,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.space5,
  },
  formCard: {},
  input: {
    backgroundColor: colors.backgroundFaf,
    height: spacing.touchTarget,
    paddingHorizontal: spacing.space4,
    borderRadius: radius.pill,
    marginBottom: spacing.space3,
    borderColor: colors.white,
    borderWidth: 1,
    color: colors.textPrimary,
  },
  button: {
    marginTop: spacing.space2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textGray,
  },
});
