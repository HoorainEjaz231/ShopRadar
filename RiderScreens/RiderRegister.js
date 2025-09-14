import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UploadImage from '../components/uploadimage';
import SelectImage from '../components/selectImage';
import network from '../network';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RiderRegister({ route, navigation }) {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [city, setCity] = useState("");
  const [bikeNumber, setBikeNumber] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageurl,setimageurl] = useState("")
  const [liecenceurl,setlienceurl] = useState("")
  const [Contact,setContact] = useState("")
  const { CustomerID } = route.params;

  const Upload1stImage = async () => {

    setUploading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        console.log(
          `Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`
        );
      },
      (error) => {
        console.log(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setimageurl(downloadURL)
          setUploading(false);
          console.log(downloadURL)
          handle2ndImage
        });
      }
    );
};


  const handleAddMain = async (downloadURL) => {
    
    const riderData = {
      Name: name,
      IDCardNumber: idCardNumber,
      City: city,
      BikeNumber: bikeNumber,
      LicenseImage: downloadURL,  // Assuming this will be handled similarly
      RiderProfileImage: imageurl,
      Contact:Contact
    };
    console.log(riderData)

    try {
      const response = await fetch(network.serverurl + "/Rider/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riderData),
      });
      const data = await response.json();
      console.log(data);
      if(data){
        try {
          const response = await fetch(`${network.serverurl}/Customer/${CustomerID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ RiderID: data.RiderID }),
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
      

       // Redirect to RiderHome
    } catch (error) {
      console.error(error);
    }
  };

  const handle2ndImage = () => {
    if (licenseImage) {
      console.log("handle2ndimage")
      UploadImage(licenseImage, setUploading, handleAddMain);
    } else {
      console.log("plz select image first")
    }
  };
  const handle1stImage = () => {
  
    if (image) {
      Upload1stImage()
      handle2ndImage()
    } else {
      console.log("plz select image first")
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="ID Card Number"
          onChangeText={setIdCardNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Bike Number"
          onChangeText={setBikeNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact"
          onChangeText={setContact}
        />
        <Text style={{color:'gray',marginTop:5}}>Select Licence Image</Text>
        <SelectImage  image={licenseImage} setImage={setLicenseImage}/>
        <Text style={{color:'gray',marginTop:5}}>Select Profile Image</Text>
        <SelectImage image={image} setImage={setImage} />
        <Button title="Register" onPress={handle1stImage} disabled={uploading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
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
});
