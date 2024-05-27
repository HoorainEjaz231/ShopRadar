import React from "react";
import { View, Text, TouchableOpacity ,Image} from "react-native";
import MapView,{Marker} from "react-native-maps";
import { featured } from "../constants";
import { useNavigation } from "@react-navigation/native";

import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { EmptyCart } from "../slices/CartSlices";

export default function DeliveryScreen() {
    const shop = useSelector( state => state.Shop.Shop)
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const cancelOrder = () => {
      navigation.navigate('HomeScreen')
      dispatch(EmptyCart())
    }
  return (
    <View style={{flex:1}}>
      <MapView
        initialRegion={{
            latitude: shop.lat,
            longitude: shop.lng,
            latitudeDelta:0.01,
            longitudeDelta:0.01
        }}
        style={{flex:1}}
        mapType='standard'
      >
        <Marker 
            coordinate={{
                latitude: shop.lat,
                longitude:shop.lng,

            }}
            title={shop.name}
            description={shop.description}
            pinColor={themeColors.bgColor(1)}
        />

      </MapView>
      <View style={{borderTopLeftRadius: 48, borderTopRightRadius: 48,marginTop: -48, backgroundColor: '#FFFFFF',  position: 'relative', }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between',paddingHorizontal: 20,paddingTop: 40, }}>
            <View>
                <Text style={{fontSize: 18, color: '#4B5563',   fontWeight: '600',}}>Estimated Arrival</Text>
                <Text style={{fontSize: 30,color: '#4B5563', fontWeight: '800',  }}>20 - 30 Minutes</Text>
                <Text style={{marginTop: 8, color: '#4B5563',fontWeight: '600',}}>Your Order is own its way</Text>
            </View>
            <Image style={{width:90,height:90}} source={require("../assets/3d Scooter -2.jpg")}/>
        </View>
        <View 
        style={{backgroundColor: themeColors.bgColor(0.8), padding: 8,               // p-2 (assuming 4 pixels per unit)
        flexDirection: 'row',    // flex-row
        justifyContent: 'space-between', // justify-between
        alignItems: 'center',     // items-center
        borderRadius: 9999,       // rounded-full (a very large value for perfect circle)
        marginVertical: 20,       // my-5 (assuming 4 pixels per unit)
        marginHorizontal: 8,}}
        
        >
            <View  style={{ padding: 4, borderRadius: 9999,backgroundColor:'rgba(255,255,255,0.4)'}}>
                <Image style={{height: 64,       // h-16 (assuming 4 pixels per unit)
    width: 64,        // w-16 (assuming 4 pixels per unit)
    borderRadius: 32}} source={require("../assets/rider.jpg")}/>
            </View>
            <View style={{marginLeft: 12,flex:1}}>
                <Text style={{ fontSize: 22,  fontWeight: 'bold',   color: '#FFFFFF', }}>Noamn Ali</Text>
                <Text style={{fontWeight: '600',color: '#FFFFFF',}}>Your Rider</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center',  marginRight: 12, marginHorizontal:12}}>
                <TouchableOpacity style={{backgroundColor: '#FFFFFF', padding: 8, borderRadius: 9999,marginRight:5}}>
                    <Icon.Phone fill={themeColors.bgColor(1)} strokeWidth={1} stroke={themeColors.bgColor(1)}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelOrder} style={{ backgroundColor: '#FFFFFF', padding: 8,  borderRadius: 9999,  }}>
                    <Icon.X strokeWidth={4} stroke={'red'}/>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );
}
