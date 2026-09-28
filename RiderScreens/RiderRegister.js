import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SelectImage from '../components/selectImage';
import { storageApi, ridersApi, customersApi } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing, typography } from '../theme';
import { Card, Button } from '../components/ui';

export default function RiderRegister({ route, navigation }) {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [city, setCity] = useState("");
  const [bikeNumber, setBikeNumber] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [Contact,setContact] = useState("")
  const { CustomerID } = route.params;

  const handleAddMain = async (licenseUrl, profileUrl) => {
    const riderData = {
      Name: name,
      IDCardNumber: idCardNumber,
      City: city,
      BikeNumber: bikeNumber,
      LicenseImage: licenseUrl,
      RiderProfileImage: profileUrl,
      Contact:Contact
    };
    console.log(riderData)

    try {
      const data = await ridersApi.createRider(riderData);
      console.log(data);
      if(data){
        try {
          await customersApi.updateCustomer(CustomerID, { RiderID: data.RiderID });
        } catch (error) {
          console.error(error);
        }

        try {
          // Step 1: Retrieve the existing user object
          const user = await AsyncStorage.getItem('user');
          let userData = JSON.parse(user);

          // Step 2: Update the user object with the new VendorID
          if (userData) {
            console.log(data.RiderID)
            userData.RiderID = data.RiderID;

            // Step 3: Save the updated user object back to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            console.log('User updated successfully:', userData);
            navigation.navigate('View Profile');
          } else {
            console.log('No user data found in AsyncStorage');
          }
        } catch (error) {
          console.error('Error updating user data:', error);
        }

      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    if (!image || !licenseImage) {
      console.log("plz select image first")
      return;
    }
    setUploading(true);
    try {
      const profileUrl = await storageApi.uploadImage(image, 'riders');
      const licenseUrl = await storageApi.uploadImage(licenseImage, 'riders');
      await handleAddMain(licenseUrl, profileUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.formContainer}>
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Name"
          placeholderTextColor={colors.textGray}
          onChangeText={setName}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="ID Card Number"
          placeholderTextColor={colors.textGray}
          onChangeText={setIdCardNumber}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="City"
          placeholderTextColor={colors.textGray}
          onChangeText={setCity}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Bike Number"
          placeholderTextColor={colors.textGray}
          onChangeText={setBikeNumber}
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Contact"
          placeholderTextColor={colors.textGray}
          onChangeText={setContact}
        />
        <Text style={[typography.label, styles.fieldLabel]}>Select Licence Image</Text>
        <SelectImage  image={licenseImage} setImage={setLicenseImage}/>
        <Text style={[typography.label, styles.fieldLabel]}>Select Profile Image</Text>
        <SelectImage image={image} setImage={setImage} />
        <Button title="Register" onPress={handleRegister} disabled={uploading} style={styles.submitButton} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.space5,
    paddingTop: spacing.space8,
  },
  formContainer: {},
  input: {
    height: spacing.touchTarget,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundFaf,
    marginBottom: spacing.space3,
    paddingHorizontal: spacing.space4,
    color: colors.textPrimary,
  },
  fieldLabel: {
    color: colors.textGray,
    marginTop: spacing.space2,
    marginBottom: spacing.space2,
  },
  submitButton: {
    marginTop: spacing.space4,
  },
});
