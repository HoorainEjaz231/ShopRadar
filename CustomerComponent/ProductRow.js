import React from "react";
import { View, Text, TouchableOpacity, StyleSheet ,Image,Alert} from 'react-native';
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { RemoveFromCart, addToCart, selectCartItemsById,selectCartItems, EmptyCart } from "../slices/CartSlices";
import { useNavigation } from "@react-navigation/native";

export default function ProductRow({ item }) {
  const dispatch = useDispatch();
  const totalItems = useSelector(state => selectCartItemsById(state, item.ProductID));
  const itemQuantity = totalItems.length > 0 ? totalItems[0].quantity : 0;
  const cartItems = useSelector(selectCartItems);
const navigation = useNavigation()
  const handleIncrease = () => {
    if (cartItems.length > 0 && cartItems[0].VendorID !== item.VendorID) {
      Alert.alert(
        "Different Vendor",
        "You already have items from a different vendor in your cart. Would you like to clear the cart and add this item?",
        [
          {
            text: "Go Back",
            onPress: () => navigation.goBack(),
            style: "cancel"
          },
          {
            text: "Clear Cart",
            onPress: () => {
              dispatch(EmptyCart())
              dispatch(addToCart({ ...item }));
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      dispatch(addToCart({ ...item }));
    }
  };

  const handleDecrease = () => {
    console.log("Removing item from cart:", item.ProductID);
    dispatch(RemoveFromCart({ id: item.ProductID }));
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: item.Image }} 
        style={styles.productImage} 
      />
      <View style={{ marginBottom: 12, flex: 1 }}>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontSize: 20 }}>{item.ProductName}</Text>
          <Text style={{ color: '#374151' }}>{item.ProductDescription && item.ProductDescription.length > 65 
                  ? `${item.ProductDescription.substring(0, 65)}...` 
               : item.ProductDescription }</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 12, alignItems: 'center' }}>
          <Text style={{ color: '#374151', fontSize: 18, fontWeight: 'bold' }}>Rs {item.Price}</Text>
          {
            itemQuantity === 0 ? null : <TouchableOpacity
              disabled={itemQuantity === 0}
              onPress={handleDecrease}
              style={{ backgroundColor: themeColors.bgColor(1), padding: 4, borderRadius: 9999 }}
            >
              <Icon.Minus strokeWidth={2} height={20} width={20} stroke={'white'} />
            </TouchableOpacity>
          }
          <Text>{itemQuantity}</Text>
          <TouchableOpacity
            onPress={handleIncrease}
            style={{ backgroundColor: themeColors.bgColor(1), padding: 4, borderRadius: 9999 }}
          >
            <Icon.Plus strokeWidth={2} height={20} width={20} stroke={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 12,
    marginHorizontal: 8,

  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
});
