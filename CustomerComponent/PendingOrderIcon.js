import React from "react";
import {View,Text, TouchableOpacity,StyleSheet} from 'react-native'
import { colors, radius, spacing, typography, shadows } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function PendingOrders ({pendingOrdersCount}) {
    const navigation = useNavigation();

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.container}
             onPress={()=>navigation.navigate("In Progress Orders")}

            >
                <View style={styles.countBadge}>
                <Text style={styles.countText}>{pendingOrdersCount}</Text>
                </View>
                <Text style={styles.label}>In Progress Orders</Text>
            </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 10,
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
});
