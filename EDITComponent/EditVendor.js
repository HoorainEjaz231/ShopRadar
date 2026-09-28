import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { vendorsApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Card, Button, ModalAlert } from '../components/ui';

const EditVendor = ({ route, navigation }) => {
  const { VendorID } = route.params; // Fetch the VendorID from route params

  const [VendorBusinessName, setVendorBusinessName] = useState('');
  const [market, setMarket] = useState('');
  const [CompanyAddress, setCompanyAddress] = useState('');
  const [City, setCity] = useState('');

  const [Contact, setContact] = useState('');
  const [Email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', onConfirm: null });

  const closeAlert = () => setAlert((a) => ({ ...a, visible: false }));

  // Fetch vendor details based on VendorID
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const vendor = await vendorsApi.getVendorById(VendorID);

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
        setAlert({ visible: true, title: 'Error', message: 'Failed to fetch vendor details', onConfirm: closeAlert });
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
      await vendorsApi.updateVendor(VendorID, updatedVendor);

      setAlert({
        visible: true,
        title: 'Success',
        message: 'Vendor updated successfully',
        onConfirm: () => {
          closeAlert();
          navigation.goBack();
        },
      });
    } catch (error) {
      console.error('Failed to update vendor:', error);
      setAlert({ visible: true, title: 'Error', message: 'Failed to update vendor', onConfirm: closeAlert });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, styles.loadingText]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[typography.display, styles.title]}>Edit Vendor</Text>

      <Card style={styles.formCard}>
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Vendor Name"
          placeholderTextColor={colors.textGray}
          value={VendorBusinessName}
          onChangeText={setVendorBusinessName}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Market"
          placeholderTextColor={colors.textGray}
          value={market}
          onChangeText={setMarket}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Email"
          placeholderTextColor={colors.textGray}
          value={Email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Contact"
          placeholderTextColor={colors.textGray}
          value={Contact}
          onChangeText={setContact}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Company Address"
          placeholderTextColor={colors.textGray}
          value={CompanyAddress}
          onChangeText={setCompanyAddress}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="City"
          placeholderTextColor={colors.textGray}
          value={City}
          onChangeText={setCity}
        />

        <Button title="Save Changes" onPress={saveVendorDetails} style={styles.button} />
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

export default EditVendor;

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
