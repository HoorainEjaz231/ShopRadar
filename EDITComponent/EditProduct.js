import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { themeColors } from '../theme';
import network from '../network';

const EditProduct = ({ route, navigation }) => {
  const { ProductID } = route.params; // Fetch ProductID from route params
    console.log('id',ProductID)
  const [ProductName, setProductName] = useState('');
  const [Price, setPrice] = useState('');
  const [Discount, setDiscount] = useState('');
  const [ProductDescription, setProductDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${network.serverurl}/Product/Products/${ProductID}`);
        const product = response.data;

        setProductName(product.ProductName || '');
        setPrice(product.Price.toString() || '');
        setDiscount(product.Discount.toString() || '');
        setProductDescription(product.ProductDescription || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        Alert.alert('Error', 'Failed to fetch product details');
        setIsLoading(false);
      }
    };

    if (ProductID) {
      fetchProductDetails();
    }
  }, [ProductID]);

  // Save updated product details
  const saveProductDetails = async () => {
    try {
      const updatedProduct = {
        ProductName,
        Price: parseFloat(Price),
        Discount: parseFloat(Discount),
        ProductDescription,
      };

      await axios.put(`${network.serverurl}/Product/updateProduct/${ProductID}`, updatedProduct);

      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Failed to update product:', error);
      Alert.alert('Error', 'Failed to update product');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={ProductName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={Price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Discount"
        value={Discount}
        keyboardType="numeric"
        onChangeText={setDiscount}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Description"
        value={ProductDescription}
        onChangeText={setProductDescription}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProductDetails}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProduct;

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
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: themeColors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
