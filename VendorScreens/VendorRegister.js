import React,{useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ScrollView} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { storageApi, vendorsApi, customersApi } from '../lib/api';
import SelectImage from '../components/selectImage';
import { categories ,markets } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { Card, Button } from '../components/ui';

export default function VendorRegister ({ route, navigation }){
  const { CustomerID } = route.params;
    const [image,setimage]= useState(null)
    const [uploading, setUploading] = useState(false);
    const [category,setCategory] = useState("")
    const [BuninessName,setBusinessName] = useState("")
    const [CompanyAddress,setCompanyAddress] = useState("")
    const [City,setCity] = useState("")
    const [State,setState] = useState("")
    const [Country,setCountry] = useState("")
    const [Latitude,setLatitude] = useState(null)
    const [Longitude,setLongitude] = useState(null)
    const [Contact,setContact] = useState("")
    const [Email,setEmail] = useState("")
    const [Market,setMarket] = useState("")

   const categoryNames = categories.map(category => category.name);
    const MarketNames = markets.map(MARKET => MARKET.name);


    const handleAddMain = async (downloadURL) => {
      const productData = {
        BusinessName: BuninessName,
        CompanyAddress: CompanyAddress,
        City: City,
        StateProvince: State,
        Country:Country,
        Contact: Contact,
        Market:Market,
        Email:Email,
        Latitude: Latitude,
        Longitude,Longitude,
        ShopCategory: category,
        Image:downloadURL
      };

      try {
        const data = await vendorsApi.createVendor(productData);
        console.log(data);
        if(data){
          try {
            await customersApi.updateCustomer(CustomerID, { VendorID: data.VendorID });
          } catch (error) {
            console.error(error);
          }

          try {
            // Step 1: Retrieve the existing user object
            const user = await AsyncStorage.getItem('user');
            let userData = JSON.parse(user);

            // Step 2: Update the user object with the new VendorID
            if (userData) {
              userData.VendorID = data.VendorID;

              // Step 3: Save the updated user object back to AsyncStorage
              await AsyncStorage.setItem('user', JSON.stringify(userData));

              console.log('User updated successfully:', userData);
            } else {
              console.log('No user data found in AsyncStorage');
            }
          } catch (error) {
            console.error('Error updating user data:', error);
          }

        }




        navigation.navigate('HomeScreen')



      } catch (error) {
        console.error(error);
      }
    };


    const handleImage = async () => {
      if (image) {
        setUploading(true);
        try {
          const url = await storageApi.uploadImage(image, 'vendors');
          await handleAddMain(url);
        } catch (error) {
          console.error(error);
        } finally {
          setUploading(false);
        }
      } else {
        console.log("plz select image first")
      }
    };

   return(
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Card style={styles.companyInfoContainer}>
      <TextInput
        style={[typography.body, styles.input]}
        placeholder="Business Name"
        placeholderTextColor={colors.textGray}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={[typography.body, styles.input]}
        placeholder="Company Address"
        placeholderTextColor={colors.textGray}
        onChangeText={setCompanyAddress}
      />
      <View style={styles.inlineInputs}>
        <TextInput
          style={[typography.body, styles.input, styles.inlineInput]}
          placeholder="City"
          placeholderTextColor={colors.textGray}
          onChangeText={setCity}
        />
        <TextInput
          style={[typography.body, styles.input, styles.inlineInput]}
          placeholder="State/Province"
          placeholderTextColor={colors.textGray}
          onChangeText={setState}
        />
        <TextInput
          style={[typography.body, styles.input, styles.inlineInput]}
          placeholder="Country"
          placeholderTextColor={colors.textGray}
          onChangeText={setCountry}
        />
      </View>

      <View style={styles.inlineInputs}>

        <TextInput
          style={[typography.body, styles.input, styles.inlineInput]}
          placeholder="Latitude"
          placeholderTextColor={colors.textGray}
          onChangeText={setLatitude}
        />
        <TextInput
          style={[typography.body, styles.input, styles.inlineInput]}
          placeholder="Longitude"
          placeholderTextColor={colors.textGray}
          onChangeText={setLongitude}
        />

      </View>
      <TextInput
        style={[typography.body, styles.input]}
        placeholder="Contact"
        placeholderTextColor={colors.textGray}
        onChangeText={setContact}
      />
      <TextInput
        style={[typography.body, styles.input]}
        placeholder="Email"
        placeholderTextColor={colors.textGray}
        onChangeText={setEmail}
      />
      <RNPickerSelect
              onValueChange={(value) => setMarket(value)}
              items={MarketNames.map((category) => ({ label: category, value: category }))}
              placeholder={{label: 'Select Market',value:null}}
              value={Market}
              style={pickerSelectStyles}
            />
      <RNPickerSelect
              onValueChange={(value) => setCategory(value)}
              items={categoryNames.map((category) => ({ label: category, value: category }))}
              placeholder={{label: 'Select Category',value:null}}
              value={category}
              style={pickerSelectStyles}
            />
      <SelectImage image={image} setImage={setimage} />
    </Card>


    {/* Add other sections of the form here */}

    <Button title="Register" onPress={handleImage} />
  </ScrollView>
   )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing.space5,
      paddingTop: spacing.space8,
      paddingBottom: spacing.space8,
    },
    companyInfoContainer: {
      marginBottom: spacing.space5,
    },
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
    inlineInputs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.space2,
    },
    inlineInput: {
      flex: 1,
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: spacing.space3,
      padding: spacing.space3,
      borderColor: colors.white,
      borderWidth: 1,
      borderRadius: radius.md,
    },
    image: {
      width: 100,
      height: 100,
    },

  });

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 14,
      paddingVertical: spacing.space3,
      paddingHorizontal: spacing.space4,
      borderWidth: 1,
      borderColor: colors.white,
      borderRadius: radius.pill,
      color: colors.textPrimary,
      backgroundColor: colors.backgroundFaf,
      paddingRight: 30,
      marginBottom: spacing.space3,
    },
    inputAndroid: {
      fontSize: 14,
      paddingHorizontal: spacing.space4,
      paddingVertical: spacing.space2,
      borderWidth: 1,
      borderColor: colors.white,
      borderRadius: radius.pill,
      color: colors.textPrimary,
      backgroundColor: colors.backgroundFaf,
      paddingRight: 30,
      marginBottom: spacing.space3,
    },
  });
