import React,{useState,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,Button,TouchableOpacity,Image} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import network from '../network';
import { storage } from '../Firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import SelectImage from '../components/selectImage';
import UploadImage from '../components/uploadimage';
import { categories ,markets } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const response = await fetch(network.serverurl+"/vendor/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        const data = await response.json();
        console.log(data);
        if(data){
          try {
            const response = await fetch(`${network.serverurl}/Customer/${CustomerID}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ VendorID: data.VendorID }),
            });
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
   

    const handleImage = () => {
      if (image) {
       
        UploadImage(image, setUploading, handleAddMain);
      } else {
        console.log("plz select image first")
      }
    };

   return(
    <View style={styles.container}>
    <View style={styles.companyInfoContainer}>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        onChangeText={setBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Company Address"
        onChangeText={setCompanyAddress}
      />
      <View style={styles.inlineInputs}>
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="City"
          onChangeText={setCity}
        />
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="State/Province"
          onChangeText={setState}
        />
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="Country"
          onChangeText={setCountry}
        />
      </View>
      
      <View style={styles.inlineInputs}>
        
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="Latitude"
          onChangeText={setLatitude}
        />
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="Longitude"
          onChangeText={setLongitude}
        />
        
      </View>
      <TextInput
        style={styles.input}
        placeholder="Contact"
        onChangeText={setContact}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
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
    </View>
   
    
    {/* Add other sections of the form here */}
   
    <Button title="Register" onPress={handleImage} />
  </View>
   )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
      backgroundColor: '#FFFFFF',
    },
    companyInfoContainer: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    input: {
      height: 40,
      borderColor: '#CCCCCC',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    inlineInputs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inlineInput: {
      flex: 1,
      marginRight: 5,
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 10,
      padding: 10,
      borderColor: '#CCCCCC',
      borderWidth: 1,
      borderRadius: 5,
    },
    image: {
      width: 100,
      height: 100,
    },
   
  });

  // const pickerSelectStyles = StyleSheet.create({
  //   inputIOS: {
  //     height: 40,
  //     borderColor: '#CCCCCC',
  //     borderWidth: 1,
  //     borderRadius: 5,
  //     paddingHorizontal: 10,
  //     marginBottom: 10,
  //     color: '#333333',
  //   },
  //   inputAndroid: {
  //     height: 40,
  //     borderColor: '#CCCCCC',
  //     borderWidth: 1,
  //     borderRadius: 5,
  //     paddingHorizontal: 10,
  //     marginBottom: 10,
  //     color: '#333333',
  //   },
  // });
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
      marginBottom: 20,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
      marginBottom: 20,
    },
  });
  