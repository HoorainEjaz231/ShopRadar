import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { customersApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Card, Button, ModalAlert } from '../components/ui';

const EditCustomer = ({ route, navigation }) => {
  const { customer } = route.params; // Fetch the customer data from route params

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [country, setCountry] = useState('');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', onConfirm: null });

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

  const closeAlert = () => setAlert((a) => ({ ...a, visible: false }));

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
      await customersApi.updateCustomer(customer.CustomerID, updatedCustomer);

      setAlert({
        visible: true,
        title: 'Success',
        message: 'Customer updated successfully',
        onConfirm: () => {
          closeAlert();
          navigation.goBack();
        },
      });
    } catch (error) {
      console.error('Failed to update customer:', error);
      setAlert({ visible: true, title: 'Error', message: 'Failed to update customer', onConfirm: closeAlert });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[typography.display, styles.title]}>Edit Customer</Text>

      <Card style={styles.formCard}>
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Full Name"
          placeholderTextColor={colors.textGray}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Email"
          placeholderTextColor={colors.textGray}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Phone"
          placeholderTextColor={colors.textGray}
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Address"
          placeholderTextColor={colors.textGray}
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="City"
          placeholderTextColor={colors.textGray}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="State/Province"
          placeholderTextColor={colors.textGray}
          value={stateProvince}
          onChangeText={setStateProvince}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Country"
          placeholderTextColor={colors.textGray}
          value={country}
          onChangeText={setCountry}
        />
        <Button title="Save Changes" onPress={saveCustomer} style={styles.button} />
        <Button variant="secondary" title="Cancel" onPress={() => navigation.goBack()} style={styles.button} />
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

export default EditCustomer;

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
    textAlign: 'center',
    marginBottom: spacing.space5,
  },
  formCard: {},
  input: {
    backgroundColor: colors.backgroundFaf,
    height: spacing.touchTarget,
    paddingHorizontal: spacing.space4,
    borderRadius: radius.pill,
    marginBottom: spacing.space3,
    borderWidth: 1,
    borderColor: colors.white,
    color: colors.textPrimary,
  },
  button: {
    marginTop: spacing.space2,
  },
});
