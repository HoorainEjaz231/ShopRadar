import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Icon from "react-native-feather"; // Import Feather icons
import network from '../network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeColors } from '../theme';
import axios from 'axios';


export default function VendorAllProducts({navigation, route}) {
  const navigation1 = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const {VendorID} = route.params; 
 // console.log(VendorID)
 
  useEffect(() => {
    fetchProducts();
}, []);
  const fetchProducts = async () => {
    const vendorId = parseInt(VendorID)
    try {
      const response = await fetch(network.serverurl+"/Product/"+vendorId); // Replace with your actual API URL
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
     // console.error(error);
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    // Handle edit action
  };



const handleDelete = (product) => {
  Alert.alert(
    "Confirm Deletion",
    `Are you sure you want to delete the product: ${product.ProductName}?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const response = await axios.delete(`${network.serverurl}/Product/deleteProduct/${product.ProductID}`);
            if (response.status === 200) {
              Alert.alert("Success", "Product deleted successfully!");
              // Optionally refresh your product list or navigate back
            } else {
              Alert.alert("Error", "Failed to delete the product.");
            }
          } catch (error) {
            console.error("Error deleting product:", error);
            Alert.alert("Error", "There was an error deleting the product.");
          }
        },
        style: "destructive",
      },
    ]
  );
};


  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.Image }} style={styles.productImage} />
      <TouchableOpacity style={styles.menuButton} onPress={() => showMenu(item)}>
        <Icon.MoreVertical width={24} height={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.ProductName}</Text>
        <Text style={styles.productCategory}>{item.ProductCategory}</Text>
        <Text style={styles.productDescription}>{item.ProductDescription}</Text>
        <Text style={styles.productPrice}>Rs {item.Price}</Text>
        {item.Discount > 0 && (
          <Text style={styles.productDiscount}>Discount: {item.Discount}%</Text>
        )}
      </View>
      
    </View>
  );

  const showMenu = (item) => {
    Alert.alert(
      'Options',
      '',
      [
        { text: 'Edit', onPress: () => navigation.navigate("EditProduct",{ProductID: item.ProductID}) },
        { text: 'Delete', onPress: () => handleDelete(item) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.ProductID.toString()}
        contentContainerStyle={styles.flatListContainer}
       ListEmptyComponent={<Text style={styles.noDataText}>No Product available</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation1.navigate('AddProducts')}>
        <Icon.Plus width={30} height={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backbutton}
          >
            <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    
    backgroundColor: '#FFFFFF',
  },
  flatListContainer: {
    paddingTop: 60, // Adjust this value for top margin
  
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    textAlign:'center'
  },
  backbutton: {
    position: 'absolute',
    top: 13,
    left: 20,
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
    marginHorizontal:5
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 2,
  },
  productInfo: {
    marginTop: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productCategory: {
    fontSize: 16,
    color: '#666',
  },
  productDescription: {
    fontSize: 14,
    color: '#999',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#000',
  },
  productDiscount: {
    fontSize: 14,
    color: '#FF0000',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
