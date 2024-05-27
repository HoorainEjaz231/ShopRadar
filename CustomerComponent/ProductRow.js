import React from "react";
import { View, Text,Image,Button, TouchableOpacity,StyleSheet} from 'react-native'
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { RemoveFromCart, addToCart, selectCartItemsById } from "../slices/CartSlices";
export default function ProductRow({item}){
    const dispatch = useDispatch()
    const totalItems = useSelector(state => selectCartItemsById(state , item.id));
    const handleIncrease = () => {
        dispatch(addToCart({...item}))
    }
    const handleDecrease = () => {
        dispatch(RemoveFromCart({id: item.id}))
    }
    return(
        <View style={styles.container}>
           <Image  style={{borderRadius: 24,height:100, width:100}} source={require("../assets/foodiesfeed.com_burger-with-melted-cheese.jpg")}          />
           <View style={{marginBottom: 12,flex:1}}>
                <View style={{paddingLeft: 12}}>
                    <Text style={{fontSize: 20}}>{item.name}</Text>
                    <Text style={{color: '#374151'}}>{item.description}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 12,alignItems: 'center',}}>
                    <Text style={{color: '#374151',fontSize: 18,fontWeight: 'bold'}}>RS {item.price}</Text>
                    {
                        !totalItems.length?null:<TouchableOpacity 
                        disabled={!totalItems.length}
                        onPress={handleDecrease}
                        style={{backgroundColor:themeColors.bgColor(1),padding: 4,borderRadius: 9999,}}>
                            <Icon.Minus strokeWidth={2} height={20} width={20} stroke={'white'} />
                        </TouchableOpacity>
                    }
                    <Text>{totalItems.length}</Text>
                    <TouchableOpacity 
                    onPress={handleIncrease}
                    style={{backgroundColor:themeColors.bgColor(1),padding: 4,borderRadius: 9999,}}>
                        <Icon.Plus strokeWidth={2} height={20} width={20} stroke={'white'} />
                    </TouchableOpacity>
                </View>
           </View>
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',      // flex-row
      alignItems: 'center',      // items-center
      backgroundColor: '#FFFFFF', // bg-white
      padding: 12,               // p-3 (assuming 4 pixels per unit)
      borderRadius: 24,          // rounded-3xl (assuming 8 pixels per unit, this can vary)
      shadowColor: '#000',       // shadow-2xl
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,             // Android shadow elevation
      marginBottom: 12,          // mb-3 (assuming 4 pixels per unit)
      marginHorizontal: 8,       // mx-2 (assuming 4 pixels per unit)
    },
  });