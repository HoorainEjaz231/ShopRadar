import React from "react";
import {View,Text, TouchableOpacity,StyleSheet} from 'react-native'
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../slices/CartSlices";
export default function CartIcon () {
    const navigation = useNavigation();
    const CartItem = useSelector(selectCartItems);
    const CartTotal = useSelector(selectCartTotal)
    if(!CartItem.length) return;
    return(
        <View style={{position: 'absolute',  bottom: 20,   width: '100%',zIndex: 50,}}>
            <TouchableOpacity style={[styles.container,{backgroundColor:themeColors.bgColor(1)}]}
            onPress={()=>navigation.navigate("Cart")}
               
            >   
                <View  style={{backgroundColor:'rgba(255,255,255,0.3)',padding: 8, paddingHorizontal: 16, borderRadius: 9999, }}>
                <Text style={{ fontWeight: '800', color: '#FFFFFF',fontSize: 18,}}>{CartItem.length}</Text>
                </View>
                <Text style={{flex: 1,  textAlign: 'center',  fontWeight: '800', color: '#FFFFFF',  fontSize: 18, }}>View Cart</Text>
                <Text style={{fontWeight: '800', color: '#FFFFFF',   fontSize: 18,}}>{CartTotal}</Text>
            </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',       // flex-row
      justifyContent: 'space-between', // justify-between
      alignItems: 'center',        // items-center
      marginHorizontal: 20,        // mx-5 (assuming 4 pixels per unit)
      borderRadius: 9999,          // rounded-full
      padding: 16,                  // p-4 (assuming 4 pixels per unit)
      paddingTop: 12,               // py-3 (assuming 4 pixels per unit)
      shadowColor: '#000',         // shadow-lg
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
    },
  });