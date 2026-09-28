import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import * as Icon from "react-native-feather";
import { colors, radius, spacing, typography, shadows } from "../theme";
import { IconContainer, Button, ModalAlert } from "../components/ui";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RemoveFromCart, selectCartItems, selectCartTotal, clearCart, EmptyCart } from "../slices/CartSlices";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ordersApi, orderDetailsApi } from '../lib/api';
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
    const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

    const [DeliveryType,setDeliveryType] = useState('Delivery')
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const vendorLocation = {
        latitude: Shop.Latitude,
        longitude: Shop.Longitude
    };

    const showAlert = (title, message) => setAlert({ visible: true, title, message });
    const closeAlert = () => setAlert((a) => ({ ...a, visible: false }));

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
            const orderData = await ordersApi.createOrder(order);
            const orderID = orderData.OrderID;
            const productDetails = cartItems.map(item => ({
                ProductID: item.ProductID,
                Quantity: item.quantity,
                Price: item.Price
            }));

            const orderDetailData = await orderDetailsApi.createOrderDetails(orderID, { products: productDetails });

            console.log('Order details uploaded:', orderDetailData);
            showAlert('Order placed', 'Order details uploaded successfully!');
            saveOrderID(orderDetailData.OrderID)
            dispatch(EmptyCart())
            navigation.navigate("OrderPreparing");
        } catch (error) {
            console.error('Error uploading order details:', error);
            showAlert('Order failed', 'An error occurred while uploading the order details. Please try again.');
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
        <View style={styles.screen}>
            {/* Back button */}
            <View style={styleCartScreen.headerRow}>
                <IconContainer variant="header" onPress={() => navigation.goBack()} style={styleCartScreen.backButton}>
                    <Icon.ArrowLeft strokeWidth={3} stroke={colors.textPrimary} width={22} height={22} />
                </IconContainer>
                <View>
                    <Text style={[typography.headerTitle, styleCartScreen.title]}>
                        Your Cart
                    </Text>
                    <Text style={[typography.bodySm, styleCartScreen.shopName]}>{Shop.BusinessName}</Text>
                </View>
            </View>


            {/* Products */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styleCartScreen.scrollContent}
                style={styles.screen}
            >
                 <View style={styleCartScreen.deliveryTypeRow}>
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
            <Text style={[typography.bodySm, styleCartScreen.deliveryEta]}>
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
        <Text style={[typography.bodySm, styleCartScreen.pickupText]}>Self Pickup</Text>
      </View>
    )
  }

  <TouchableOpacity onPress={handleDeliveryType}>
    <Text style={[typography.chipSelected, styleCartScreen.changeLink]}>Change</Text>
  </TouchableOpacity>
</View>
                {
                    Object.entries(groupedItems).map(([key, items]) => {
                        let dish = items[0];
                        return (
                            <View key={key}
                                style={styleCartScreen.cartitem1}
                            >
                                <Text style={[typography.chipSelected, styleCartScreen.itemQty]}>{items.length} x</Text>
                                <Image source={{ uri: dish.Image }} // Assuming dish.Image is a URL to the image
                                    style={styleCartScreen.itemImage}
                                />
                                <Text style={[typography.body, styleCartScreen.itemName]}>{dish.ProductName}</Text>
                                <Text style={[typography.cardTitle, styleCartScreen.itemPrice]}>RS {dish.Price}</Text>
                                <IconContainer variant="forward" onPress={() => { dispatch(RemoveFromCart({ id: dish.ProductID })) }} style={styleCartScreen.removeButton}>
                                    <Icon.Minus strokeWidth={2} height={16} width={16} stroke={colors.white} />
                                </IconContainer>
                            </View>
                        );
                    })
                }
            </ScrollView>
            {/* Total */}
            <View style={styleCartScreen.summary} >
                <View style={styleCartScreen.summaryRow}>
                    <Text style={[typography.bodySm, styleCartScreen.summaryLabel]}>Cart Total</Text>
                    <Text style={[typography.bodySm, styleCartScreen.summaryLabel]}>RS {parseInt(cartTotal)}</Text>
                </View>
                {
                    DeliveryType == 'Delivery' ? <View style={styleCartScreen.summaryRow}>
                    <Text style={[typography.bodySm, styleCartScreen.summaryLabel]}>Delivery Fee</Text>
                    <Text style={[typography.bodySm, styleCartScreen.summaryLabel]}>RS {parseInt(50+deliveryFee*30)}</Text>
                </View>:null
                }

                <View style={[styleCartScreen.summaryRow, { marginTop: spacing.space1 }]}>
                    <Text style={[typography.cardTitle, styleCartScreen.summaryTotalLabel]}>Order Total</Text>
                    <Text style={[typography.cardTitle, styleCartScreen.summaryTotalLabel]}>RS {DeliveryType == 'Delivery'? (parseInt(50+deliveryFee*30) + parseInt(cartTotal)):(parseInt(cartTotal))}</Text>
                </View>
                <Button
                    title={DeliveryType === 'Delivery' ? "Place Delivery Order" : "Place Pickup Order"}
                    onPress={placeOrder}
                    style={{ marginTop: spacing.space3 }}
                />
            </View>

            <ModalAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                confirmLabel="OK"
                onConfirm={closeAlert}
                onRequestClose={closeAlert}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.background,
        flex: 1,
    },
});

const styleCartScreen = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.space4,
        paddingHorizontal: spacing.space5,
        paddingTop: spacing.space8,
        gap: spacing.space3,
    },
    backButton: {},
    title: {
        color: colors.textPrimary,
    },
    shopName: {
        color: colors.textGray,
    },
    scrollContent: {
        paddingBottom: spacing.space6,
    },
    deliveryTypeRow: {
        backgroundColor: colors.backgroundFaf,
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: radius.lg,
        flexDirection: 'row',
        paddingHorizontal: spacing.space4,
        alignItems: 'center',
        marginHorizontal: spacing.space4,
        marginBottom: spacing.space3,
        justifyContent: 'space-between',
    },
    deliveryEta: {
        flex: 1,
        paddingLeft: spacing.space1,
        color: colors.textPrimary,
    },
    pickupText: {
        paddingLeft: spacing.space1,
        marginLeft: spacing.space8,
        color: colors.textPrimary,
    },
    changeLink: {
        color: colors.primary,
    },
    cartitem1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundFaf,
        borderWidth: 1,
        borderColor: colors.white,
        paddingHorizontal: spacing.space4,
        paddingVertical: spacing.space2,
        borderRadius: radius.lg,
        marginHorizontal: spacing.space4,
        marginBottom: spacing.space3,
        ...shadows.card,
    },
    itemQty: {
        color: colors.primary,
        marginRight: spacing.space1,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: radius.md,
    },
    itemName: {
        flex: 1,
        color: colors.textPrimary,
        marginLeft: spacing.space2,
    },
    itemPrice: {
        color: colors.textPrimary,
        marginRight: spacing.space3,
    },
    removeButton: {
        backgroundColor: colors.primary,
    },
    summary: {
        backgroundColor: colors.backgroundFaf,
        padding: spacing.space6,
        paddingHorizontal: spacing.space7,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.white,
        ...shadows.modal,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        color: colors.textLight,
    },
    summaryTotalLabel: {
        color: colors.textPrimary,
    },
});
