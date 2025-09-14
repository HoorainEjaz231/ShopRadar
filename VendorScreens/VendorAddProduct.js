import React, { useState ,useEffect} from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../Firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import network from '../network';
import { categories ,markets } from "../constants";
const categoryNames = categories.map(category => category.name);
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function AddProductScreen() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
 
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userdetail,setuser] = useState(null)


  useEffect(()=>{
    const UserInfo = async () => {
  
    try{
      const UserData = await AsyncStorage.getItem('user')
      const user = JSON.parse(UserData)
      setuser(JSON.stringify(user.VendorID))
    
    }catch(error){
      console.log(error)
    }
    }

    UserInfo();
  },[])
  // Image Handler
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
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
        console.error(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          handleAddProduct(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  const handleAddProduct = async (url) => {
    const productData = {
      VendorID: userdetail,
      ProductName: productName,
      ProductCategory: category,
      Price: price,
      Image: url,
      Discount: discount,
      ProductDescription:description,
    };


    try {
      const response = await fetch(network.serverurl+"/Product/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      console.log(data);
      setCategory("")
      setDescription("")
      setDiscount("")
      setImage(null)
      setPrice("")
      setProductName("")

     

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <RNPickerSelect
              onValueChange={(value) => setCategory(value)}
              items={categoryNames.map((category) => ({ label: category, value: category }))}
              placeholder={{label: 'Select Category',value:null}}
              value={category}
              style={pickerSelectStyles}
            />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Select Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Discount %"
        value={discount}
        onChangeText={setDiscount}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Product Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Add Product" onPress={uploadImage} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  imagePlaceholder: {
    color: '#CCCCCC',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333333',
  },
  inputAndroid: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333333',
  },
});
