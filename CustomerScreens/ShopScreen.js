import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import ProductRow from '../CustomerComponent/ProductRow';
import CartIcon from "../CustomerComponent/cartIcon";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";
import { setShop } from "../slices/ShopSlices";
import axios from 'axios';
import network from "../network";

export default function ShopScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [SelectedProducts, setSelectedProduct] = useState(null);
  const [SearchedProduct,setSearchedProduct] = useState(null)
  const [Vendor,setVendor] = useState(null)
  const [Vendorimage,setVendorimage]  = useState(null)
  const [VendorBusinessName,setVendorBusinessName]  = useState(null)
  const [VendorMarket,setVendorMarket]  = useState(null)
  const item = params;
  useEffect(() => {

    setSelectedProduct(null);
    setProducts([]);
    setVendor(null);
   
    if (params?.vendor) {
     
      dispatch(setShop({ ...params.vendor }));
      VendorDetail(params.vendor.VendorID);
      
      FetchallProducts(params.vendor.VendorID);
      if(params.vendor.ProductID){
        FetchSelectedProduct(params.vendor.ProductID);
      }
    } else if (params?.VendorID) {
   
      dispatch(setShop({ ...params }));
      FetchallProducts(params.VendorID);
      setVendorimage(item.Image)
      setVendorBusinessName(item.BusinessName)
      setVendorMarket(item.Market)
    }
  }, [params]);

  const FetchallProducts = (ID) =>{
    
    try{
        axios.get(network.serverurl+"/Product/"+ID)
          .then(response => {
            setProducts(response.data);
          })
          .catch(error => {
            console.log(error);
          });
    
    }catch (error){
      console.log('Dispatch Shop Error',error)
    }
  }

  const FetchSelectedProduct = (ID) => {
    try{
      axios.get(network.serverurl+"/Product/Products/"+ID)
        .then(response => {
          console.log('selectedProduct',response.data)
          setSelectedProduct(response.data);
        })
        .catch(error => {
          console.error(error);
        });
  
  }catch (error){
    console.log('Dispatch Shop Error',error)
  }
  }
  const VendorDetail = () => {
    // Fetch Vendor
    axios.get(network.serverurl+"/vendor/"+item.vendor.VendorID)
    .then(response => {
      dispatch(setShop( response.data ));
     setVendor(response.data)
     setVendorimage(response.data.Image)
     setVendorBusinessName(response.data.BusinessName)
     setVendorMarket(response.data.Market)
    })
    .catch(error => {
    
      console.error(error);
    });

  }
   return (
    <View>
      <CartIcon />
      <StatusBar style="light" />
      <ScrollView>
        <View style={{ position: 'relative' }}>
          {/* {
            SelectedProducts?<Image style={{ width: '100%', height: 288 }} source={{ uri: Vendor.Image }} />:<Image style={{ width: '100%', height: 288 }} source={{ uri: item.Image }} />
          } */}
          <Image style={{ width: '100%', height: 288 }} source={{ uri: Vendorimage }} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.container}
          >
            <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
          </TouchableOpacity>
        </View>
        <View
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#FFFFFF', marginTop: -48, paddingTop: 24 }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{VendorBusinessName}</Text>
            <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 4 }}>
                <Image style={{ height: 16, width: 16 }} source={require("../assets/star-icon-19125.png")} />
                <Text style={{ fontSize: 12 }}>
                  <Text style={{ color: '#047857' }}>{item.stars}</Text>
                  <Text style={{ color: '#047857' }}> ({item.reviews}) Reviews</Text>
                  <Text style={{ fontWeight: '600' }}> · {item.category}</Text>
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 4 }}>
                <Icon.MapPin color="gray" width='15' height='15' />
                <Text style={{ color: '#4B5563', fontSize: 10 }}> {VendorMarket}</Text>
              </View>
            </View>
            <Text style={{ color: '#6B7280', marginTop: 8 }}>{item.description}</Text>
          </View>
        </View>
       
        <View style={{ paddingBottom: 144, backgroundColor: '#FFFFFF' }}>
        <View style={{marginBottom:20}}>
          {SelectedProducts?<ProductRow item={SelectedProducts}/>:null}
        </View>
          <Text style={{ paddingHorizontal: 16, paddingVertical: 16, fontSize: 28, fontWeight: 'bold' }}>{SelectedProducts?'All Products':'Products'}</Text>
          {/* Products */}
          {products.map((product, index) => (
            <ProductRow item={product} key={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: 16,
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
});
