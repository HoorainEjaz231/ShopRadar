import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image,Linking ,Alert} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation , useRoute} from "@react-navigation/native";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { EmptyCart } from "../slices/CartSlices";
import AsyncStorage from '@react-native-async-storage/async-storage';
import network from "../network";
import call from 'react-native-phone-call';
import RNPickerSelect from 'react-native-picker-select';



export default function DeliveryScreen({ route }) {
  const [order, setOrder] = useState(null);
  const shop = useSelector(state => state.Shop.Shop);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Rider,setRider] = useState(null)
  const [lastOrderID, setLastOrderID] = useState(null);
  const [IsPickup,setIsPickup] = useState(false)
  const [Contact,setContact] = useState(null)

  const [riderAssigned, setRiderAssigned] = useState(false);
  const { params } = useRoute();
  const item = params;
  // console.log('item data',item)
  //console.log('shop data',shop)
  const OrderID = item?item.OrderID:null
  

      const  Latitude = item || shop ? (item?item.Vendor.Latitude:shop.Latitude):37.78825
      const  Longitude = item || shop? (item?item.Vendor.Longitude:shop.Longitude):-122.4324

  const fetchOrder = async (orderID) => {
    try {
       const response = await axios.get(`${network.serverurl}/orders/${orderID}`);
       
   
      const orderData = response.data;
      setOrder(orderData);
      console.log('Orders Data',orderData);
      if(orderData){
        let type = orderData.DeliveryType == 'Delivery'?false:true
      setIsPickup(type)
     
      
      }
   
      // Check if RiderID is assigned
      if (orderData.RiderID) {
        fetchRiderDetails(orderData.RiderID)
        setRiderAssigned(true); // Stop further checks
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };


  //Cancel Order Alert
  const showCancelOrderAlert = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel the order?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: cancelOrder
        },
      ],
      { cancelable: true }
    );
  };
  const fetchLastOrderID = async () => {
    try {
      const existingOrderIDs = await AsyncStorage.getItem('orderIDs');
    
      if (existingOrderIDs) {
        const orderIDsArray = JSON.parse(existingOrderIDs);
         // Debugging line
        const orderID = orderIDsArray[orderIDsArray.length - 1];
        
        setLastOrderID(orderID);
        fetchOrder(orderID);
      } else {
        console.log('No  Order IDs found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Failed to fetch Order ID:', error);
    }
  };
  useEffect(() => {
    // OrderID for pending order
    OrderID?null:fetchLastOrderID()
    if(item){
      let type = item.DeliveryType == 'Delivery'?false:true
      setIsPickup(type)
    }

    // Set up an interval to continuously fetch order data if RiderID is not assigned
    const interval = setInterval(() => {
     
        
      if (lastOrderID && !riderAssigned || OrderID && !riderAssigned) {
        lastOrderID?fetchOrder(lastOrderID):fetchOrder(OrderID)
      }
    
    }, 5000); 

    // Cleanup: Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [lastOrderID, riderAssigned,OrderID]);


  //route.params.OrderID
  const cancelOrder = async () => {
    let CancelOrderID = OrderID?OrderID:lastOrderID
    console.log('this is cancellation Order iD',CancelOrderID)
    try {
      const response = await axios.put(`${network.serverurl}/orders/${CancelOrderID}`, {
        OrderStatus: 'Cancelled',
        isDelivered: false,
      });
      if(response.data){
        console.log('response data of markder deliver ', response.data)
        navigation.navigate('HomeScreen');
         dispatch(EmptyCart());
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }

    
  }

  const fetchRiderDetails = async (RiderID) => {
    try {
      const response = await axios.get(`${network.serverurl}/Rider/${RiderID}`);
      const orderData = response.data;
      console.log('Rider  Details:', orderData);
      setRider(orderData)
      return orderData;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  const setNumber = async (props) => {
    if(Rider){
      setContact(Rider.Contact)
      if(Contact){
        makeCall()
      }
      console.log('Rider Make Call ' , Contact)
    }else{
      setContact(props)
      if(Contact){
        makeCall()
      }
      console.log('props Caleed',)
    }
  }
  const makeCall = () => {
    if (!Contact) {
      Alert.alert('Error', 'No contact number available.');
      return;
    }
    const args = {
      number: Contact,
      prompt: true, // Show the native dialer prompt
    };
  
    call(args).catch((error) => console.error('Error making the call:', error));
  };

  const navigateToVendor = () => {
    const vendorLatitude = item?item.Vendor.Latitude:shop.Latitude
    const vendorLongitude = item?item.Vendor.Longitude:shop.Longitude;
  
    // Use a map linking library to open the vendor's location in a map app
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${vendorLatitude},${vendorLongitude}`);
  };
  

  const hanldePickedUp =async () => {
    try {
      await axios.put(`${network.serverurl}/orders/${OrderID}`, {
        OrderStatus: 'Delivered',
        isDelivered: true
      });
      navigation.replace('HomeScreen');
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  }
  
  
    const FetchRiderInfo =() =>{
      return(
        <View style={{ borderTopLeftRadius: 48, borderTopRightRadius: 48, marginTop: -48, backgroundColor: '#FFFFFF', position: 'relative', }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40, }}>
          <View>
            <Text style={{ fontSize: 18, color: '#4B5563', fontWeight: '600', }}>Estimated Arrival</Text>
            <Text style={{ fontSize: 30, color: '#4B5563', fontWeight: '800', }}>20 - 30 Minutes</Text>
            <Text style={{ marginTop: 8, color: '#4B5563', fontWeight: '600', }}>Your Order is on its way</Text>
          </View>
          <Image style={{ width: 90, height: 90 }} source={require("../assets/3d Scooter -2.jpg")} />
        </View>

        {order ? (
          order.RiderID ? (
            <View
              style={{
                backgroundColor: themeColors.bgColor(0.8), padding: 8,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                borderRadius: 9999, marginVertical: 20, marginHorizontal: 8,
              }}
            >
              <View style={{ padding: 4, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.4)' }}>
                <Image style={{ height: 64, width: 64, borderRadius: 32 }} source={Rider ? (Rider.RiderProfileImage ? { uri: Rider.RiderProfileImage } : require('../assets/rider.jpg')) : null} />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', }}>{Rider?Rider.Name:null}</Text>
                <Text style={{ fontWeight: '600', color: '#FFFFFF', }}>Your Rider</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginHorizontal: 12 }}>
                <TouchableOpacity style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 9999, marginRight: 5 }}
                  onPress={setNumber}
                >
                  <Icon.Phone fill={themeColors.bgColor(1)} strokeWidth={1} stroke={themeColors.bgColor(1)} />
                </TouchableOpacity>
                <TouchableOpacity onPress={showCancelOrderAlert} style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 9999, }}>
                  <Icon.X strokeWidth={4} stroke={'red'} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: themeColors.bgColor(0.8), padding: 8,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                borderRadius: 9999, marginVertical: 20, marginHorizontal: 8,
              }}
            >
            
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', }}>Fetching Rider ...</Text>
               
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginHorizontal: 12 }}>
    
                <TouchableOpacity onPress={showCancelOrderAlert} style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 9999, }}>
                  <Icon.X strokeWidth={4} stroke={'red'} />
                </TouchableOpacity>
              </View>
            </View>
          )
        ) : (
          <View
          style={{
            backgroundColor: themeColors.bgColor(0.8), padding: 8,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            borderRadius: 9999, marginVertical: 20, marginHorizontal: 8,
          }}
        >
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', }}>Loading Order ...</Text>
          </View>
        </View>
        )}
      </View>
      )
    }

    const SelfPickUP = () => {
      return(
        <View style={{ borderTopLeftRadius: 48, borderTopRightRadius: 48, marginTop: -48, backgroundColor: '#FFFFFF', position: 'relative', }}>
          <TouchableOpacity
      style={{ backgroundColor:'#FF474C', padding: 3, borderRadius: 9999, alignItems: 'center',alignSelf:'flex-end',marginRight:20,marginTop:20 }}
      onPress={showCancelOrderAlert}
    >
      <Icon.X strokeWidth={2} stroke={'#FFFFFF'} />
    </TouchableOpacity>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 5, }}>
  
    <View>
      <Text style={{ fontSize: 18, color: '#4B5563', fontWeight: '600', }}>Pickup Location</Text>
      <Text style={{ fontSize: 30, color: '#4B5563', fontWeight: '800', }}>{item?(item.Vendor.BusinessName):shop.BusinessName}</Text>
      <Text style={{ marginTop: 8, color: '#4B5563', fontWeight: '600', }}>{item?(item.Vendor.CompanyAddress):shop.CompanyAddress}</Text>
      <Text style={{ marginTop: 4, color: '#4B5563', fontWeight: '600', }}>{item?(item.Vendor.Market):shop.Market}</Text>
      <Text style={{ marginTop: 4, color: '#4B5563', fontWeight: '600', }}>{item?(item.Vendor.Contact):shop.Contact}</Text>
    </View>
    <Image style={{ width: 90, height: 90 }} source={item? { uri: item.Vendor.Image } :{ uri: shop.Image }} />
  </View>

  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20, paddingHorizontal: 20 }}>
    <TouchableOpacity
      style={{ backgroundColor: themeColors.bgColor(0.8), padding: 12, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}
      onPress={navigateToVendor}
    >
      <Icon.MapPin strokeWidth={2} stroke={'#FFFFFF'} />
    </TouchableOpacity>

    <TouchableOpacity
      style={{ backgroundColor: themeColors.bgColor(0.8), padding: 12, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}
      onPress={()=>setNumber(item?(item.Vendor.Contact):shop.Contact)}
    >
      <Icon.Phone strokeWidth={2} stroke={'#FFFFFF'} />
    </TouchableOpacity>

    <TouchableOpacity
      style={{ backgroundColor:themeColors.bgColor(0.8), padding: 12, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}
      onPress={hanldePickedUp}
    >
      <Text style={{color:'#FFFFFF', fontSize:15,fontWeight:'700'}}>Picked Up</Text>
    </TouchableOpacity>
  </View>
</View>

      )
    }
  return (
    <View style={{ flex: 1 }}>
    <MapView
      initialRegion={{
        latitude: Latitude,
        longitude: Longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }}
      style={{ flex: 1 }}
      mapType='standard'
    >
      <Marker
        coordinate={{
          latitude: Latitude,
          longitude: Longitude,
        }}
        title={OrderID?item.BusinessName:shop.BusinessName}
        
        pinColor={themeColors.bgColor(1)}
      />
    </MapView>
    {
       IsPickup?<SelfPickUP />:<FetchRiderInfo />
    }
       
    </View>
  );
}
