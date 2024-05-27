import React from "react";
import {View,Text,StyleSheet,FlatList,TouchableOpacity} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-paper";
const products = [
    { id: '1', name: 'Product 1', price: '$10' },
    { id: '2', name: 'Product 2', price: '$20' },
    { id: '3', name: 'Product 3', price: '$30' },
  ];
export default function VendorHome (){
   const navigation1 = useNavigation();
    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
      );
    return(
        <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.fab} onPress={() =>navigation1.navigate('AddProducts') }>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
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
    productContainer: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 20,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    productPrice: {
      fontSize: 16,
      color: '#666',
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
  });