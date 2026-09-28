import React,{useEffect} from "react";
import {View,Text,Image} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { colors, radius } from "../theme";

export default function OrderPreparing () {
    const navigation = useNavigation();
    useEffect(()=>{
        setTimeout(()=>{
            navigation.replace('Delivery')
        },3000)
    },[])
    return(
        <View style={{flex: 1,backgroundColor: colors.background, justifyContent: 'center',alignItems: 'center', }}>
            <Image source={require("../assets/TwuB.gif")} style={{ height: 80,width: 80, borderRadius: radius.pill }}/>
        </View>
    )
}