import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation , useRoute} from "@react-navigation/native";
import { colors, radius, spacing, typography, shadows } from "../theme";
import { ModalAlert, IconContainer } from "../components/ui";
import * as Icon from "react-native-feather";
import { ordersApi, ridersApi } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { EmptyCart } from "../slices/CartSlices";
import AsyncStorage from '@react-native-async-storage/async-storage';
import call from 'react-native-phone-call';



export default function DeliveryScreen({ route }) {
  const [order, setOrder] = useState(null);
  const shop = useSelector(state => state.Shop.Shop);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Rider,setRider] = useState(null)
  const [lastOrderID, setLastOrderID] = useState(null);
  const [IsPickup,setIsPickup] = useState(false)
  const [Contact,setContact] = useState(null)
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: '' });

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
      const orderData = await ordersApi.getOrderById(orderID);
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
    setCancelAlertVisible(true);
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
    setCancelAlertVisible(false);
    let CancelOrderID = OrderID?OrderID:lastOrderID
    console.log('this is cancellation Order iD',CancelOrderID)
    try {
      const data = await ordersApi.updateOrder(CancelOrderID, {
        OrderStatus: 'Cancelled',
        isDelivered: false,
      });
      if(data){
        console.log('response data of markder deliver ', data)
        navigation.navigate('HomeScreen');
         dispatch(EmptyCart());
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }


  }

  const fetchRiderDetails = async (RiderID) => {
    try {
      const orderData = await ridersApi.getRiderById(RiderID);
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
      setErrorAlert({ visible: true, message: 'No contact number available.' });
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
      await ordersApi.updateOrder(OrderID, {
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
        <View style={styles.sheet}>
        <View style={styles.sheetHeaderRow}>
          <View>
            <Text style={[typography.sectionTitle, styles.sheetLabel]}>Estimated Arrival</Text>
            <Text style={[typography.display, styles.sheetHeading]}>20 - 30 Minutes</Text>
            <Text style={[typography.bodySm, styles.sheetSubLabel]}>Your Order is on its way</Text>
          </View>
          <Image style={styles.scooterImage} source={require("../assets/3d Scooter -2.jpg")} />
        </View>

        {order ? (
          order.RiderID ? (
            <View style={styles.riderPill}>
              <View style={styles.riderAvatarWrap}>
                <Image style={styles.riderAvatar} source={Rider ? (Rider.RiderProfileImage ? { uri: Rider.RiderProfileImage } : require('../assets/rider.jpg')) : null} />
              </View>
              <View style={styles.riderInfo}>
                <Text style={[typography.cardTitle, styles.riderName]}>{Rider?Rider.Name:null}</Text>
                <Text style={[typography.bodySm, styles.riderRole]}>Your Rider</Text>
              </View>
              <View style={styles.riderActions}>
                <IconContainer variant="header" onPress={setNumber} style={styles.riderActionButton}>
                  <Icon.Phone width={20} height={20} fill={colors.primary} strokeWidth={1} stroke={colors.primary} />
                </IconContainer>
                <IconContainer variant="header" onPress={showCancelOrderAlert} style={styles.riderActionButton}>
                  <Icon.X width={20} height={20} strokeWidth={3} stroke={colors.danger} />
                </IconContainer>
              </View>
            </View>
          ) : (
            <View style={styles.riderPill}>
              <View style={styles.riderInfo}>
                <Text style={[typography.cardTitle, styles.riderName]}>Fetching Rider ...</Text>
              </View>
              <View style={styles.riderActions}>
                <IconContainer variant="header" onPress={showCancelOrderAlert} style={styles.riderActionButton}>
                  <Icon.X width={20} height={20} strokeWidth={3} stroke={colors.danger} />
                </IconContainer>
              </View>
            </View>
          )
        ) : (
          <View style={styles.riderPill}>
            <View style={styles.riderInfo}>
              <Text style={[typography.cardTitle, styles.riderName]}>Loading Order ...</Text>
            </View>
          </View>
        )}
      </View>
      )
    }

    const SelfPickUP = () => {
      return(
        <View style={styles.sheet}>
          <IconContainer variant="header" onPress={showCancelOrderAlert} style={styles.pickupCloseButton}>
            <Icon.X width={18} height={18} strokeWidth={2} stroke={colors.danger} />
          </IconContainer>
  <View style={styles.pickupHeaderRow}>
    <View>
      <Text style={[typography.sectionTitle, styles.sheetLabel]}>Pickup Location</Text>
      <Text style={[typography.display, styles.sheetHeading]}>{item?(item.Vendor.BusinessName):shop.BusinessName}</Text>
      <Text style={[typography.bodySm, styles.sheetSubLabel]}>{item?(item.Vendor.CompanyAddress):shop.CompanyAddress}</Text>
      <Text style={[typography.bodySm, styles.sheetSubLabel]}>{item?(item.Vendor.Market):shop.Market}</Text>
      <Text style={[typography.bodySm, styles.sheetSubLabel]}>{item?(item.Vendor.Contact):shop.Contact}</Text>
    </View>
    <Image style={styles.scooterImage} source={item? { uri: item.Vendor.Image } :{ uri: shop.Image }} />
  </View>

  <View style={styles.pickupActionsRow}>
    <IconContainer variant="header" onPress={navigateToVendor} style={styles.pickupActionButton}>
      <Icon.MapPin width={20} height={20} strokeWidth={2} stroke={colors.white} />
    </IconContainer>

    <IconContainer variant="header" onPress={()=>setNumber(item?(item.Vendor.Contact):shop.Contact)} style={styles.pickupActionButton}>
      <Icon.Phone width={20} height={20} strokeWidth={2} stroke={colors.white} />
    </IconContainer>

    <TouchableOpacity
      style={styles.pickedUpButton}
      onPress={hanldePickedUp}
    >
      <Text style={[typography.chipSelected, styles.pickedUpText]}>Picked Up</Text>
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

        pinColor={colors.primary}
      />
    </MapView>
    {
       IsPickup?<SelfPickUP />:<FetchRiderInfo />
    }

    <ModalAlert
      visible={cancelAlertVisible}
      title="Cancel Order"
      message="Are you sure you want to cancel the order?"
      cancelLabel="No"
      onCancel={() => setCancelAlertVisible(false)}
      confirmLabel="Yes"
      onConfirm={cancelOrder}
      onRequestClose={() => setCancelAlertVisible(false)}
    />
    <ModalAlert
      visible={errorAlert.visible}
      title="Error"
      message={errorAlert.message}
      confirmLabel="OK"
      onConfirm={() => setErrorAlert({ visible: false, message: '' })}
      onRequestClose={() => setErrorAlert({ visible: false, message: '' })}
    />

    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -48,
    backgroundColor: colors.background,
    position: 'relative',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space5,
    paddingTop: spacing.space8,
  },
  sheetLabel: {
    color: colors.textLight,
  },
  sheetHeading: {
    color: colors.textPrimary,
  },
  sheetSubLabel: {
    marginTop: spacing.space1,
    color: colors.textLight,
  },
  scooterImage: {
    width: 90,
    height: 90,
  },
  riderPill: {
    backgroundColor: colors.primary,
    padding: spacing.space2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: radius.pill,
    marginVertical: spacing.space5,
    marginHorizontal: spacing.space2,
    ...shadows.card,
  },
  riderAvatarWrap: {
    padding: spacing.space1,
    borderRadius: radius.pill,
    backgroundColor: colors.pillBackground,
  },
  riderAvatar: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
  riderInfo: {
    marginLeft: spacing.space3,
    flex: 1,
  },
  riderName: {
    color: colors.white,
  },
  riderRole: {
    color: colors.white,
  },
  riderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.space3,
    gap: spacing.space1,
  },
  riderActionButton: {
    backgroundColor: colors.white,
  },
  pickupCloseButton: {
    backgroundColor: colors.dangerTint,
    alignSelf: 'flex-end',
    marginRight: spacing.space5,
    marginTop: spacing.space5,
  },
  pickupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space5,
    paddingTop: spacing.space1,
  },
  pickupActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.space5,
    paddingHorizontal: spacing.space5,
  },
  pickupActionButton: {
    backgroundColor: colors.primary,
  },
  pickedUpButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space3,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickedUpText: {
    color: colors.white,
  },
});
