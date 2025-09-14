import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RemoveFromCart, selectCartItems, selectCartTotal, clearCart, EmptyCart } from "../slices/CartSlices";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import network from "../network";
import LocationSelector from '../components/LocationSelector';
import HaversineDistance from '../components/HaversineDistance'; // Ensure the path is correct

export default function CartScreen() {
    const [groupedItems, setGroupedItems] = useState({});
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [profileData,setProfileData ] = useState(null)
    const Shop = useSelector(state => state.Shop.Shop);
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    
    const [DeliveryType,setDeliveryType] = useState('Delivery')
    const navigation = useNavigation();
    const dispatch = useDispatch();
    
    const vendorLocation = {
        latitude: Shop.Latitude,
        longitude: Shop.Longitude
    };

    useEffect(() => {
        
        const handledata = async () =>{
            const items = cartItems.reduce((group, item) => {
                if (group[item.ProductID]) {
                    group[item.ProductID].push(item);
                } else {
                    group[item.ProductID] = [item];
                }
                return group;
            }, {});
            setGroupedItems(items);
            console.log(cartItems)
          if(cartItems && cartItems.length <= 0){
           navigation.goBack()
          }
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    let data = JSON.parse(userData)
               
                    setProfileData(data.CustomerID);
                  
                }
          
                
              } catch (error) {
                console.error('Error fetching customer ID', error);
              }
        }
        handledata();
    }, [cartItems]);

    const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
        useEffect(() => {
            if (deliveryLocation) {
                const R = 6371; // Radius of the Earth in kilometers

                const lat1 = toRadians(vendorLocation.latitude);
                const lon1 = toRadians(vendorLocation.longitude);
                const lat2 = toRadians(deliveryLocation.latitude);
                const lon2 = toRadians(deliveryLocation.longitude);
            
                const dLat = lat2 - lat1;
                const dLon = lon2 - lon1;
            
                const a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            
                const distanceInKm = R * c;
                setDeliveryFee(distanceInKm.toFixed(2))
             }
        }, [deliveryLocation]);


        const saveOrderID = async (newOrderID) => {
            try {
              // Step 1: Retrieve the existing Order IDs from AsyncStorage
              const existingOrderIDs = await AsyncStorage.getItem('orderIDs');
              
              // Parse the existingOrderIDs or initialize it as an empty array
              let orderIDsArray = existingOrderIDs ? JSON.parse(existingOrderIDs) : [];
          
              // Step 2: Append the new OrderID to the array
              orderIDsArray.push(newOrderID);
          
              // Step 3: Save the updated array back to AsyncStorage
              await AsyncStorage.setItem('orderIDs', JSON.stringify(orderIDsArray));
              
              // Log the saved Order IDs
              console.log('Order IDs saved successfully:', orderIDsArray);
            } catch (error) {
              console.error('Failed to save Order ID:', error);
            }
          };




    const handlePlaceOrder = async () => {
        const order = {
            CustomerID: profileData,
            VendorID: Shop.VendorID,
            RiderID: null,
            OrderDate: new Date().toISOString().split('T')[0],
            DeliveryAddress: deliveryAddress,
            OrderStatus: DeliveryType == 'Delivery' ?'pending':'PickUp',
            isDelivered: false,
            CustLatitude: DeliveryType === 'Delivery'?deliveryLocation.latitude:null,
            CustLongitude:DeliveryType === 'Delivery'? deliveryLocation.longitude:null,
            DeliveryType: DeliveryType,
            OrderPrice: parseInt(cartTotal),
            DeliveryFee: parseInt(DeliveryType === 'Delivery'?50+deliveryFee*30 : 0)
            
        };
  
        try {
            const orderResponse = await fetch(network.serverurl + "/orders/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });
            const orderData = await orderResponse.json();

            if (orderResponse.ok) {
                const orderID = orderData.OrderID;
                const productDetails = cartItems.map(item => ({
                    ProductID: item.ProductID,
                    Quantity: item.quantity,
                    Price: item.Price
                }));

                const orderDetails = {
                    OrderID: orderID,
                    ProductDetails: JSON.stringify({ products: productDetails })
                };

                const orderDetailResponse = await fetch(`${network.serverurl}/orderdetails/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderDetails),
                });

                if (orderDetailResponse.ok) {
                    const orderDetailData = await orderDetailResponse.json();
                    console.log('Order details uploaded:', orderDetailData);
                    Alert.alert('Order details uploaded successfully!');
                    saveOrderID(orderDetailData.OrderID)
                    dispatch(EmptyCart())
                    navigation.navigate("OrderPreparing");

                } else {
                    const errorData = await orderDetailResponse.json();
                    console.error('Failed to add order details:', errorData);
                    Alert.alert('Failed to add order details. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error uploading order details:', error);
            Alert.alert('An error occurred while uploading the order details. Please try again.');
        }
    }




    const placeOrder = async () => {
      if(profileData){
        if((DeliveryType == 'PickUp') || (DeliveryType == 'Delivery' && deliveryLocation)){
           handlePlaceOrder() 
        }else{
            console.log('Select Location 1st')
        }
     
      
      }else{
        console.log('Please Login 1st')
      }
    };

    const handleSelectLocation = (location) => {
        setDeliveryLocation(location);
    };


    const handleDeliveryType = () => {
        if(DeliveryType == 'Delivery'){
            setDeliveryType('PickUp')
        }else{
            setDeliveryType('Delivery')
        }
        console.log('type',DeliveryType)
    }
    return (
        <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            {/* Back button */}
            <View style={styleCartScreen.style1}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styleCartScreen.TouchOpacity, { backgroundColor: themeColors.bgColor(1) }]}
                >
                    <Icon.ArrowLeft strokeWidth={3} stroke="white" />
                </TouchableOpacity>
                <View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, }}>
                        Your Cart
                    </Text>
                    <Text style={{ textAlign: 'center', color: '#6B7280', }}>{Shop.BusinessName}</Text>
                </View>
            </View>
           

            {/* Distance Calculation */}
            {/* {deliveryLocation && (
                <View style={{ padding: 16 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Distance to Store</Text>
                    <HaversineDistance point1={deliveryLocation} point2={vendorLocation} />
                </View>
            )} */}

            {/* Products */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 50
                }}
                style={{ backgroundColor: '#FFFFFF', paddingTop: 20, }}
            >
                 <View style={{
                    backgroundColor: themeColors.bgColor(0.2),
                    flexDirection: 'row',
                    paddingLeft: 16,
                    paddingRight: 16,
                    alignItems: 'center',
                    marginBottom:10,
                    justifyContent: 'space-between',  // Ensures space between content and "Change" button
                }}>
  {
    DeliveryType === 'Delivery' ? (
      <>
        <Image 
          source={require("../assets/—Pngtree—big isolated motorcycle vector colorful_7255128.png")} 
          style={{ width: 80, height: 80 }} 
        />
        {
          deliveryFee === 0 ? (
            <LocationSelector 
              onSelectLocation={handleSelectLocation} 
              setDeliveryAddress={setDeliveryAddress} 
              DeliveryAddress={deliveryAddress} 
            />
          ) : (
            <Text style={{ flex: 1, paddingLeft: 5, fontWeight: '500' }}>
              {"Delivery in " + parseInt(deliveryFee * 3) + ' - ' + parseInt((3 * deliveryFee + 10)) + " Minutes"}
            </Text>
          )
        }
      </>
    ) : (
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Image 
          source={require("../assets/icons8-curbside-pickup-96.png")} 
          style={{ width: 80, height: 80 }}
        />
        <Text style={{ paddingLeft: 5, fontWeight: '500', marginLeft:50 }}>Self Pickup</Text>
      </View>
    )
  }

  <TouchableOpacity onPress={handleDeliveryType}>
    <Text style={{ fontWeight: "bold", color: themeColors.text }}>Change</Text>
  </TouchableOpacity>
</View>
                {
                    Object.entries(groupedItems).map(([key, items]) => {
                        let dish = items[0];
                        return (
                            <View key={key}
                                style={styleCartScreen.cartitem1}
                            >
                                <Text style={{ fontWeight: 'bold', color: themeColors.text, marginRight: 5 }}>{items.length} x</Text>
                                <Image source={{ uri: dish.Image }} // Assuming dish.Image is a URL to the image
                                    style={{ width: 60, height: 60, borderRadius: 28, }}
                                />
                                <Text style={{ flex: 1, fontWeight: 'bold', color: '#4B5563', marginLeft: 5 }}>{dish.ProductName}</Text>
                                <Text style={{ fontWeight: '600', fontSize: 16, marginRight: 10 }}>RS {dish.Price}</Text>
                                <TouchableOpacity
                                    onPress={() => { dispatch(RemoveFromCart({ id: dish.ProductID })) 
                              
                                }}
                                    style={{ padding: 4, borderRadius: 9999, backgroundColor: themeColors.bgColor(1) }}
                                >
                                    <Icon.Minus strokeWidth={2} height={20} width={20} stroke="white" />
                                </TouchableOpacity>
                            </View>
                        );
                    })
                }
            </ScrollView>
            {/* Total */}
            <View style={{ backgroundColor: themeColors.bgColor(0.2), padding: 24, paddingHorizontal: 32, borderTopLeftRadius: 48, borderTopRightRadius: 48, marginBottom: 16, }} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <Text style={{ color: '#4B5563', }}>Cart Total</Text>
                    <Text style={{ color: '#4B5563', }}>RS {parseInt(cartTotal)}</Text>
                </View>
                {
                    DeliveryType == 'Delivery' ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <Text style={{ color: '#4B5563', }}>Delivery Fee</Text>
                    <Text style={{ color: '#4B5563', }}>RS {parseInt(50+deliveryFee*30)}</Text>
                </View>:null
                }
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:5}}>
                    <Text style={{ color: '#4B5563', fontWeight: 'bold' }}>Order Total</Text>
                    <Text style={{ color: '#4B5563', fontWeight: 'bold' }}>RS {DeliveryType == 'Delivery'? (parseInt(50+deliveryFee*30) + parseInt(cartTotal)):(parseInt(cartTotal))}</Text>
                </View>
                <View>
                    <TouchableOpacity
                         onPress={placeOrder}
                        
                        style={{ backgroundColor: themeColors.bgColor(1), padding: 12, borderRadius: 9999, marginTop:10}}
                    >
                        <Text style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', fontSize: 18, }}>
                            {
                                DeliveryType === 'Delivery'? "Place Delivery Order" : "Place Pickup Order"
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styleCartScreen = StyleSheet.create({
    style1: {
        position: 'relative',
        paddingVertical: 16,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 2,
        marginTop: 30
    },
    TouchOpacity: {
        position: 'absolute',
        zIndex: 10,
        borderRadius: 9999,
        padding: 4,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 3,
        top: 20,
        left: 8,
    },
    cartitem1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        marginHorizontal: 8,
        marginBottom: 12,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
        marginHorizontal: 12,
    }
});
