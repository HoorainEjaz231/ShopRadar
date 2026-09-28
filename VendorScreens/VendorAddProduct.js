import React, { useState ,useEffect} from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { storageApi, productsApi } from '../lib/api';
import { categories ,markets } from "../constants";
const categoryNames = categories.map(category => category.name);
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing, typography } from '../theme';
import { Card, Button } from '../components/ui';




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
      setuser(user.VendorID)

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
    try {
      const url = await storageApi.uploadImage(image, 'products');
      await handleAddProduct(url);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
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
      const data = await productsApi.createProduct(productData);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.formCard}>
      <TextInput
        style={[typography.body, styles.input]}
        placeholder="Product Name"
        placeholderTextColor={colors.textGray}
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
        style={[typography.body, styles.input]}
        placeholder="Price"
        placeholderTextColor={colors.textGray}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={[typography.bodySm, styles.imagePlaceholder]}>Select Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={[typography.body, styles.input]}
        placeholder="Discount %"
        placeholderTextColor={colors.textGray}
        value={discount}
        onChangeText={setDiscount}
        keyboardType="numeric"
      />
      <TextInput
        style={[typography.body, styles.input, styles.textArea]}
        placeholder="Product Description"
        placeholderTextColor={colors.textGray}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Add Product" onPress={uploadImage} style={styles.submitButton} />
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
    paddingHorizontal: spacing.space5,
    paddingTop: spacing.space8,
    paddingBottom: spacing.space8,
  },
  formCard: {},
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
  textArea: {
    height: 100,
    borderRadius: radius.md,
    textAlignVertical: 'top',
    paddingTop: spacing.space3,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.space3,
    padding: spacing.space3,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundFaf,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
  },
  imagePlaceholder: {
    color: colors.textGray,
  },
  submitButton: {
    marginTop: spacing.space2,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    height: spacing.touchTarget,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.space4,
    marginBottom: spacing.space3,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundFaf,
  },
  inputAndroid: {
    fontSize: 14,
    height: spacing.touchTarget,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.space4,
    marginBottom: spacing.space3,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundFaf,
  },
});
