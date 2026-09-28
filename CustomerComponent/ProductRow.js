import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, radius, spacing, typography, shadows } from "../theme";
import { IconContainer, ModalAlert } from "../components/ui";
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
  const [vendorConflictVisible, setVendorConflictVisible] = useState(false);

  const handleIncrease = () => {
    if (cartItems.length > 0 && cartItems[0].VendorID !== item.VendorID) {
      setVendorConflictVisible(true);
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
      <View style={styles.info}>
        <View style={styles.textBlock}>
          <Text style={[typography.cardTitle, styles.name]}>{item.ProductName}</Text>
          <Text style={[typography.bodySm, styles.description]}>{item.ProductDescription && item.ProductDescription.length > 65
                  ? `${item.ProductDescription.substring(0, 65)}...`
               : item.ProductDescription }</Text>
        </View>
        <View style={styles.actionsRow}>
          <Text style={[typography.cardTitle, styles.price]}>Rs {item.Price}</Text>
          {
            itemQuantity === 0 ? null : (
              <IconContainer variant="forward" onPress={handleDecrease} style={styles.stepperButton}>
                <Icon.Minus strokeWidth={2} height={16} width={16} stroke={colors.white} />
              </IconContainer>
            )
          }
          <Text style={typography.body}>{itemQuantity}</Text>
          <IconContainer variant="forward" onPress={handleIncrease} style={styles.stepperButton}>
            <Icon.Plus strokeWidth={2} height={16} width={16} stroke={colors.white} />
          </IconContainer>
        </View>
      </View>

      <ModalAlert
        visible={vendorConflictVisible}
        title="Different Vendor"
        message="You already have items from a different vendor in your cart. Would you like to clear the cart and add this item?"
        cancelLabel="Go Back"
        onCancel={() => {
          setVendorConflictVisible(false);
          navigation.goBack();
        }}
        confirmLabel="Clear Cart"
        onConfirm={() => {
          setVendorConflictVisible(false);
          dispatch(EmptyCart());
          dispatch(addToCart({ ...item }));
        }}
        onRequestClose={() => setVendorConflictVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundFaf,
    borderWidth: 1,
    borderColor: colors.white,
    padding: spacing.space3,
    borderRadius: radius.lg,
    marginBottom: spacing.space3,
    marginHorizontal: spacing.space2,
    ...shadows.card,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
  },
  info: {
    marginBottom: spacing.space3,
    flex: 1,
  },
  textBlock: {
    paddingLeft: spacing.space3,
  },
  name: {
    color: colors.textPrimary,
  },
  description: {
    color: colors.textLight,
    marginTop: spacing.space1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: spacing.space3,
    alignItems: 'center',
    marginTop: spacing.space2,
  },
  price: {
    color: colors.textPrimary,
  },
  stepperButton: {
    backgroundColor: colors.primary,
  },
});
