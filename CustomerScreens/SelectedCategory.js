import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator,TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { themeColors } from '../theme'; // Adjust this if necessary
import network from '../network';
import Categories from '../CustomerComponent/categories';
import * as Icon from "react-native-feather"; // Import Feather icons
const SelectedCategoryScreen = ({navigation}) => {
  const route = useRoute();
  const item = route.params;

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(route.params)
    const fetchVendors = async () => {
      try {
        const response = await axios.get(network.serverurl + "/vendor/vendors");
        console.log(response.data)
        const filteredVendors = response.data.filter(vendor => vendor.ShopCategory === item);
        console.log(filteredVendors)
        setVendors(filteredVendors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setLoading(false);
      }
    };

    fetchVendors();
  }, [item]);

  if (loading) {
    return <ActivityIndicator size="large" color={themeColors.primary} style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.headerText,{flexDirection:'row'}]}>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
             style={{paddingTop:5}}
          >
            <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
          </TouchableOpacity>
      {/* <Image source={{ uri: image.uri }} style={styles.headerImage} /> */}
      <Text style={{fontSize: 24, fontWeight: 'bold',paddingLeft:20}}>{item}</Text>
      </View>
      
      <Categories />
      {vendors.length > 0 ? (
        vendors.map(vendor => (
          <TouchableWithoutFeedback key={vendor.VendorID} onPress={()=>navigation.navigate('ShopScreen',    {vendor} )}>
            <View  style={styles.vendorCard}>
            <Image style={styles.vendorImage} source={{ uri: vendor.Image }} />
            <View style={styles.vendorDetails}>
              <Text style={styles.vendorName}>{vendor.BusinessName}</Text>
              <View style={styles.ratingContainer}>
                <Image 
                  style={styles.ratingImage} 
                  source={require("../assets/star-icon-19125.png")} 
                />
                <Text style={styles.ratingText}>
                  <Text style={styles.ratingValue}>{vendor.AverageRating}</Text>
                  <Text style={styles.ratingCount}> ({vendor.RatingCount}) Reviews</Text>
                </Text>
              </View>
              <Text style={styles.vendorMarket}>{vendor.Market}</Text>
            </View>
          </View>
          </TouchableWithoutFeedback>
        ))
      ) : (
        <Text style={styles.noVendors}>No vendors available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  vendorImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  vendorDetails: {
    padding: 12,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingImage: {
    width: 16,
    height: 16,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  ratingValue: {
    color: '#047857',
  },
  ratingCount: {
    color: '#4B5563',
  },
  vendorMarket: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  noVendors: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#4B5563',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectedCategoryScreen;
