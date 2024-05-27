import React from "react";
import {View,Text,TextInput,ScrollView,TouchableOpacity,TouchableWithoutFeedback,Image,StyleSheet}  from 'react-native'
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";


export default function RestaurentCard1 ({item}){
    const navigation = useNavigation();
    return(
        <TouchableWithoutFeedback
            onPress={()=>navigation.navigate('ShopScreen', {...item})}
        >
            
            <View
                style={[{shadowColor: themeColors.bgColor(1), shadowRadius:7},styles.container]}
            >
                <Image style={{height: 144,width: 256, borderTopLeftRadius:30,borderTopRightRadius:30,}} source={require('../assets/foodiesfeed.com_burger-with-melted-cheese.jpg')}/>
                <View style={{paddingHorizontal: 12, paddingBottom: 16,marginVertical:8}}>
                    <Text style={{fontSize: 18,   fontWeight: 'bold',  paddingTop: 8,}}>{item.name}</Text>
                    <View style={{flexDirection: 'row',alignItems: 'center',marginHorizontal:4}}>
                        <Image style={{height: 16,width: 16,}} source={require("../assets/star-icon-19125.png")}/>
                        <Text style={{fontSize: 10,}}>
                            <Text style={{color: '#047857',}}>{item.stars}</Text>
                            <Text style={{color: '#4B5563',}}> ({item.reviews}) Reviews</Text> 
                            <Text style={{fontWeight:'600'}}> · {item.category}</Text>
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row',alignItems: 'center',marginHorizontal:4}}>
                        <Icon.MapPin color="gray" width='15' height='15' />
                        <Text style={{color: '#4B5563', fontSize: 13, }}>Nearby · {item.address}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
      marginRight: 24,
      marginBottom:10,            // mr-6 (assuming 4 pixels per unit)
      backgroundColor: '#FFFFFF', // bg-white
      borderRadius: 30,           // rounded-3xl (assuming 12 pixels per unit)
      shadowColor: '#000000',     // shadow-lg
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  });