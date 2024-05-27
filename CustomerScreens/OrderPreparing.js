import React,{useEffect} from "react";
import {View,Text,Image} from 'react-native'
import { useNavigation } from "@react-navigation/native";

export default function OrderPreparing () {
    const navigation = useNavigation();
    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('Delivery')
        },3000)
    },[])
    return(
        <View style={{flex: 1,backgroundColor: '#FFFFFF', justifyContent: 'center',alignItems: 'center', }}>
            <Image source={require("../assets/TwuB.gif")} style={{ height: 80,width: 80, borderRadius: 40, }}/>
        </View>
    )
}