import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card } from '../components/ui';
import { vendorsApi } from '../lib/api';
import Categories from '../CustomerComponent/categories';
const SelectedCategoryScreen = ({navigation}) => {
  const route = useRoute();
  const item = route.params;

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(route.params)
    const fetchVendors = async () => {
      try {
        const data = await vendorsApi.getVendors();
        const filteredVendors = data.filter(vendor => vendor.ShopCategory === item);
        setVendors(filteredVendors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setLoading(false);
      }
    };

    fetchVendors();
  }, [item]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlassHeader title={item} />
      <ScrollView contentContainerStyle={styles.content}>
        <Categories />
        {vendors.length > 0 ? (
          vendors.map(vendor => (
            <TouchableWithoutFeedback key={vendor.VendorID} onPress={()=>navigation.navigate('ShopScreen',    {vendor} )}>
              <Card style={styles.vendorCard} contentStyle={styles.vendorCardContent}>
              <Image style={styles.vendorImage} source={{ uri: vendor.Image }} />
              <View style={styles.vendorDetails}>
                <Text style={[typography.cardTitle, styles.vendorName]}>{vendor.BusinessName}</Text>
                <View style={styles.ratingContainer}>
                  <Image
                    style={styles.ratingImage}
                    source={require("../assets/star-icon-19125.png")}
                  />
                  <Text style={typography.caption}>
                    <Text style={styles.ratingValue}>{vendor.AverageRating}</Text>
                    <Text style={styles.ratingCount}> ({vendor.RatingCount}) Reviews</Text>
                  </Text>
                </View>
                <Text style={[typography.label, styles.vendorMarket]}>{vendor.Market}</Text>
              </View>
            </Card>
            </TouchableWithoutFeedback>
          ))
        ) : (
          <Text style={[typography.bodySm, styles.noVendors]}>No vendors available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingBottom: spacing.space6,
  },
  vendorCard: {
    margin: spacing.space3,
    overflow: 'hidden',
  },
  vendorCardContent: {
    padding: 0,
  },
  vendorImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  vendorDetails: {
    padding: spacing.space3,
  },
  vendorName: {
    color: colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.space1,
  },
  ratingImage: {
    width: 16,
    height: 16,
    marginRight: spacing.space1,
  },
  ratingValue: {
    color: colors.success,
  },
  ratingCount: {
    color: colors.textGray,
  },
  vendorMarket: {
    color: colors.textGray,
    marginTop: spacing.space1,
  },
  noVendors: {
    textAlign: 'center',
    marginTop: spacing.space5,
    color: colors.textGray,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectedCategoryScreen;
