import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../theme";
import * as Icon from "react-native-feather";
import ProductRow from '../CustomerComponent/ProductRow';
import CartIcon from "../CustomerComponent/cartIcon";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";
import { setShop } from "../slices/ShopSlices";
import { productsApi, vendorsApi } from "../lib/api";

export default function ShopScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [SelectedProducts, setSelectedProduct] = useState(null);
  const [SearchedProduct,setSearchedProduct] = useState(null)
  const [Vendor,setVendor] = useState(null)
  const [Vendorimage,setVendorimage]  = useState(null)
  const [VendorBusinessName,setVendorBusinessName]  = useState(null)
  const [VendorMarket,setVendorMarket]  = useState(null)
  const item = params;
  useEffect(() => {

    setSelectedProduct(null);
    setProducts([]);
    setVendor(null);

    if (params?.vendor) {

      dispatch(setShop({ ...params.vendor }));
      VendorDetail(params.vendor.VendorID);

      FetchallProducts(params.vendor.VendorID);
      if(params.vendor.ProductID){
        FetchSelectedProduct(params.vendor.ProductID);
      }
    } else if (params?.VendorID) {

      dispatch(setShop({ ...params }));
      FetchallProducts(params.VendorID);
      setVendorimage(item.Image)
      setVendorBusinessName(item.BusinessName)
      setVendorMarket(item.Market)
    }
  }, [params]);

  const FetchallProducts = async (ID) =>{
    try{
      const data = await productsApi.getProductsByVendor(ID);
      setProducts(data);
    }catch (error){
      console.log('Dispatch Shop Error',error)
    }
  }

  const FetchSelectedProduct = async (ID) => {
    try{
      const data = await productsApi.getProductById(ID);
      setSelectedProduct(data);
  }catch (error){
    console.log('Dispatch Shop Error',error)
  }
  }
  const VendorDetail = async () => {
    try {
      const data = await vendorsApi.getVendorById(item.vendor.VendorID);
      dispatch(setShop( data ));
      setVendor(data)
      setVendorimage(data.Image)
      setVendorBusinessName(data.BusinessName)
      setVendorMarket(data.Market)
    } catch (error) {
      console.error(error);
    }
  }
   return (
    <View style={styles.screen}>
      <CartIcon />
      <StatusBar style="light" />
      <ScrollView>
        <View style={{ position: 'relative' }}>
          <Image style={{ width: '100%', height: 288 }} source={{ uri: Vendorimage }} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon.ArrowLeft strokeWidth={3} stroke={colors.pillText} />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsSheet}>
          <View style={styles.detailsInner}>
            <Text style={[typography.display, styles.businessName]}>{VendorBusinessName}</Text>
            <View style={styles.metaRow}>
              <View style={styles.ratingBlock}>
                <Image style={styles.starIcon} source={require("../assets/star-icon-19125.png")} />
                <Text style={typography.caption}>
                  <Text style={styles.ratingValue}>{item.stars}</Text>
                  <Text style={styles.ratingValue}> ({item.reviews}) Reviews</Text>
                  <Text style={styles.category}> · {item.category}</Text>
                </Text>
              </View>
              <View style={styles.ratingBlock}>
                <Icon.MapPin color={colors.textGray} width={15} height={15} />
                <Text style={[typography.label, styles.market]}> {VendorMarket}</Text>
              </View>
            </View>
            <Text style={[typography.bodySm, styles.description]}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.productsSection}>
        <View style={{marginBottom: spacing.space5}}>
          {SelectedProducts?<ProductRow item={SelectedProducts}/>:null}
        </View>
          <Text style={[typography.display, styles.productsTitle]}>{SelectedProducts?'All Products':'Products'}</Text>
          {/* Products */}
          {products.map((product, index) => (
            <ProductRow item={product} key={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: spacing.space4,
    padding: spacing.space2,
    backgroundColor: colors.pillBackground,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    borderRadius: radius.pill,
  },
  detailsSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
    marginTop: -48,
    paddingTop: spacing.space6,
  },
  detailsInner: {
    paddingHorizontal: spacing.space5,
  },
  businessName: {
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    marginVertical: spacing.space1,
    justifyContent: 'space-between',
  },
  ratingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.space1,
  },
  starIcon: {
    height: 16,
    width: 16,
  },
  ratingValue: {
    color: colors.success,
  },
  category: {
    color: colors.textPrimary,
    fontFamily: typography.chipSelected.fontFamily,
  },
  market: {
    color: colors.textGray,
  },
  description: {
    color: colors.textGray,
    marginTop: spacing.space2,
  },
  productsSection: {
    paddingBottom: 144,
    backgroundColor: colors.background,
  },
  productsTitle: {
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space4,
    color: colors.textPrimary,
  },
});
