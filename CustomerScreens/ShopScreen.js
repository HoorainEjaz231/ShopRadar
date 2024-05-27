import {useNavigation ,useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";

import { View, Text, Image, ScrollView, TouchableOpacity,StyleSheet} from "react-native";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import ProductRow from '../CustomerComponent/ProductRow'
import CartIcon from "../CustomerComponent/cartIcon";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";
 import { setShop } from "../slices/ShopSlices";

 export default function ShopScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch()
  let item = params;
  
useEffect(()=>{
  if(item && item.id){
    dispatch(setShop({...item}))
  }
},[])

  return ( 

    <View>
      <CartIcon />
      <StatusBar style="light"/>
      <ScrollView>
        <View style={{position: 'relative',}}>
          <Image style={{width: '100%', height: 288}} source={item.image} />
          <TouchableOpacity
            onPress={()=>navigation.goBack()}
            style={styles.container}
          >
            <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
          </TouchableOpacity>
        </View>
        <View 
            style={{borderTopLeftRadius:40, borderTopRightRadius:40, backgroundColor: '#FFFFFF', marginTop: -48,paddingTop: 24,}}
            
        >
            <View style={{ paddingHorizontal: 20}}>
                <Text style={{fontSize: 24,fontWeight: 'bold'}}>{item.name}</Text>
                <View style={{flexDirection: 'row', marginVertical: 4,justifyContent: 'space-between',}}>
                <View style={{flexDirection: 'row',alignItems: 'center',marginHorizontal:4}}>
                        <Image style={{height: 16, width: 16,}} source={require("../assets/star-icon-19125.png")}/>
                        <Text style={{fontSize:12}}>
                            <Text style={{color: '#047857'}}>{item.stars}</Text>
                            <Text style={{color: '#047857'}}> ({item.reviews}) Reviews</Text> 
                            <Text style={{fontWeight:'600'}}> · {item.category}</Text>
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row',alignItems: 'center',marginHorizontal:4}}>
                        <Icon.MapPin color="gray" width='15' height='15' />
                        <Text style={{ color: '#4B5563', fontSize: 10,}}>Nearby · {item.address}</Text>
                    </View>  
                </View>
                <Text style={{color: '#6B7280',marginTop: 8}}>{item.description}</Text>
            </View>

        </View>
        <View style={{ paddingBottom: 144, backgroundColor: '#FFFFFF',}} >
            <Text style={{paddingHorizontal: 16, paddingVertical: 16,fontSize: 28,fontWeight: 'bold',  }}>Menu</Text>
                {/* Dishes */}
                {
                    item.dishes.map((product,index)=>
                      <ProductRow item={{...product}} key={index} />

                    )
                }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',   // absolute
    top: 56,                // top-14 (assuming 4 pixels per unit)
    left: 16,               // left-4 (assuming 4 pixels per unit)
    padding: 8,             // p-2 (assuming 4 pixels per unit)
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 9999,    // rounded-full
    shadowColor: '#000',   // shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});