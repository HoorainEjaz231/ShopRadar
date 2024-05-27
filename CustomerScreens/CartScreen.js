import React, { useEffect, useState } from "react";
import {View,Text,TouchableOpacity , Image,ScrollView,StyleSheet} from 'react-native'
import * as Icon from "react-native-feather";
import { featured } from "../constants";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
 import { useDispatch, useSelector } from "react-redux";
import { RemoveFromCart, selectCartItems, selectCartTotal } from "../slices/CartSlices";

 
export default function CartScreen () {
    const [groupedItems,setgroupedItems] =useState({})
    useEffect(()=>{
        const items = cartItems.reduce((group, item) => {
            if(group[item.id]){
                group[item.id].push(item);
            }else{
                group[item.id] = [item]
            }
            return group;
        },{})
        setgroupedItems(items)
    },[cartItems])
    //    const shop = featured.restaurants[0]
    const Shop = useSelector(state => state.Shop.Shop);
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const deliveryFee = 2;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    return(
    <View style={{backgroundColor: '#FFFFFF',flex: 1}}>
        {/* bACK button */}
        <View style={styleCartScreen.style1}>
            <TouchableOpacity
                onPress={()=>navigation.goBack()}
                style={[styleCartScreen.TouchOpacity,{backgroundColor:themeColors.bgColor(1)}]}
                
            >
                <Icon.ArrowLeft strokeWidth={3} stroke="white" />
            </TouchableOpacity>
            <View>
                <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 24,}}>
                    Your Cart
                </Text>
                <Text style={{textAlign: 'center', color: '#6B7280',}}>{Shop.name}</Text> 
            </View>
        </View>
        <View style={{backgroundColor:themeColors.bgColor(0.2), flexDirection: 'row',paddingLeft: 16,   paddingRight: 16,  alignItems: 'center',}}
        
        >
            <Image source={require("../assets/—Pngtree—big isolated motorcycle vector colorful_7255128.png")}
            style={{width: 80,   height: 80,  borderRadius: 40,}}
            />
            <Text style={{flex: 1,paddingLeft: 16,}}> Delivery in 20 - 30 Minutes</Text>
            <TouchableOpacity>
                <Text style={{fontWeight:"bold",color:themeColors.text}}>Change</Text>
            </TouchableOpacity>
        </View>
        {/* Products */}
        <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
            paddingBottom: 50
        }}
        style={{backgroundColor: '#FFFFFF',paddingTop: 20,}}
        >
            {
                Object.entries(groupedItems).map(([key, items])=>{
                    let dish = items[0]
                    return(
                        <View key={key}
                        style={styleCartScreen.cartitem1}
                        >
                            <Text  style={{fontWeight:'bold',color:themeColors.text,marginRight:5}}>{items.length} x</Text>
                            <Image  source={require("../assets/foodiesfeed.com_burger-with-melted-cheese.jpg")}
                            style={{width: 60,height: 60,borderRadius: 28,}}
                            />
                            <Text style={{flex: 1,fontWeight: 'bold',color: '#4B5563',marginLeft:5}}>{dish.name}</Text>
                            <Text style={{fontWeight: '600',fontSize: 16, marginRight:10}}>RS {dish.price}</Text>
                            <TouchableOpacity
                            onPress={()=>{dispatch(RemoveFromCart({id: dish.id}))}}
                            
                            style={{padding: 4, borderRadius: 9999,backgroundColor:themeColors.bgColor(1)}}
                            >
                                <Icon.Minus strokeWidth={2} height={20} width={20} stroke="white" />
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
        </ScrollView>
        {/* Total */}
        <View style={{backgroundColor:themeColors.bgColor(0.2), padding: 24,paddingHorizontal: 32,  borderTopLeftRadius: 48, // rounded-t-3xl (assuming 4 pixels per unit)
    borderTopRightRadius: 48,
    marginBottom: 16, }} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between',}}>
                <Text style={{color: '#4B5563',}}>Delivery Fee</Text>
                <Text style={{color: '#4B5563',}}>RS {deliveryFee}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text style={{color: '#4B5563',fontWeight:'bold'}}>Order Total</Text>
                <Text style={{color: '#4B5563',fontWeight:'bold'}}>RS {deliveryFee+cartTotal}</Text>
            </View>
            <View>
                <TouchableOpacity
                onPress={()=>navigation.navigate("OrderPreparing")}
                style={{backgroundColor:themeColors.bgColor(1), padding: 12,borderRadius: 9999,}}
                
                >
                    <Text style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold',  fontSize: 18,}}>
                        Place Order
                    </Text>
                </TouchableOpacity>
            </View>
        </View> 
    </View>
    )
}

const styleCartScreen = StyleSheet.create({
    style1:{
        position: 'relative',
        paddingVertical: 16,
        shadowColor: '#000000', // shadow-sm
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
        width: 0,
        height: 1,
        },
        elevation: 2,
        marginTop:30
    },
    TouchOpacity:{
        position: 'absolute', // absolute
        zIndex: 10, // z-10
        borderRadius: 9999, // rounded-full (a very large value for perfect circle)
        padding: 4, // p-1 (assuming 4 pixels per unit)
        shadowColor: '#000000', // shadow
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 3, // For Android shadow
        top: 20, // top-5 (assuming 4 pixels per unit)
        left: 8, // left-2 (assuming 4 pixels per unit)
    },
    cartitem1:{
        flexDirection: 'row',    // flex-row
    alignItems: 'center',    // items-center
    backgroundColor: '#FFFFFF', // bg-white
    paddingHorizontal: 16,  // px-4 (assuming 4 pixels per unit)
    paddingVertical: 8,      // py-2 (assuming 4 pixels per unit)
    borderRadius: 24,       // rounded-3xl (assuming 4 pixels per unit)
    marginHorizontal: 8,     // mx-2 (assuming 4 pixels per unit)
    marginBottom: 12,        // mb-3 (assuming 4 pixels per unit)
    shadowColor: '#000000',  // shadow-md
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    marginHorizontal: 12,
    }
})