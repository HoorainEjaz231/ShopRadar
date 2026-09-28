import React from "react";
import {View,Text, TouchableOpacity,StyleSheet} from 'react-native'
import { colors, radius, spacing, typography, shadows } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../slices/CartSlices";
export default function CartIcon () {
    const navigation = useNavigation();
    const CartItem = useSelector(selectCartItems);
    const CartTotal = useSelector(selectCartTotal)
    if(!CartItem.length) return;
    return(
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.container}
            onPress={()=>navigation.navigate("Cart")}

            >
                <View style={styles.countBadge}>
                <Text style={styles.countText}>{CartItem.length}</Text>
                </View>
                <Text style={styles.label}>View Cart</Text>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.currency}>RS  </Text>
                <Text style={styles.total}>{parseInt(CartTotal)}</Text>
                </View>
            </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.space5,
    borderRadius: radius.pill,
    padding: spacing.space4,
    paddingTop: spacing.space3,
    backgroundColor: colors.primary,
    ...shadows.modal,
  },
  countBadge: {
    backgroundColor: colors.pillBackground,
    padding: spacing.space2,
    paddingHorizontal: spacing.space4,
    borderRadius: radius.pill,
  },
  countText: {
    ...typography.chipSelected,
    color: colors.white,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    ...typography.chipSelected,
    color: colors.white,
  },
  currency: {
    ...typography.label,
    color: colors.white,
  },
  total: {
    ...typography.chipSelected,
    color: colors.white,
  },
});
