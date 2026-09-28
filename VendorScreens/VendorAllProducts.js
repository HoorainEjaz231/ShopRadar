import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Icon from "react-native-feather"; // Import Feather icons
import { productsApi } from '../lib/api';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { GlassHeader, Card, IconContainer, ModalAlert } from '../components/ui';


export default function VendorAllProducts({navigation, route}) {
  const navigation1 = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItem, setMenuItem] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState({ visible: false, product: null });
  const [resultAlert, setResultAlert] = useState({ visible: false, title: '', message: '' });

  const {VendorID} = route.params;
 // console.log(VendorID)

  useEffect(() => {
    fetchProducts();
}, []);
  const fetchProducts = async () => {
    const vendorId = parseInt(VendorID)
    try {
      const data = await productsApi.getProductsByVendor(vendorId);
      setProducts(data);
      setLoading(false);
    } catch (error) {
     // console.error(error);
      setLoading(false);
    }
  };

const confirmDelete = async () => {
  const product = deleteAlert.product;
  setDeleteAlert({ visible: false, product: null });
  try {
    await productsApi.deleteProduct(product.ProductID);
    setResultAlert({ visible: true, title: 'Success', message: 'Product deleted successfully!' });
    fetchProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
    setResultAlert({ visible: true, title: 'Error', message: 'There was an error deleting the product.' });
  }
};


  const renderProduct = ({ item }) => (
    <Card style={styles.productCard}>
      <Image source={{ uri: item.Image }} style={styles.productImage} />
      <IconContainer variant="drilldown" onPress={() => setMenuItem(item)} style={styles.menuButton}>
        <Icon.MoreVertical width={18} height={18} color={colors.textPrimary} />
      </IconContainer>
      <View style={styles.productInfo}>
        <Text style={[typography.cardTitle, styles.productName]}>{item.ProductName}</Text>
        <Text style={[typography.bodySm, styles.productCategory]}>{item.ProductCategory}</Text>
        <Text style={[typography.bodySm, styles.productDescription]}>{item.ProductDescription}</Text>
        <Text style={[typography.cardTitle, styles.productPrice]}>Rs {item.Price}</Text>
        {item.Discount > 0 && (
          <Text style={[typography.label, styles.productDiscount]}>Discount: {item.Discount}%</Text>
        )}
      </View>

    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlassHeader title="All Products" />

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.ProductID.toString()}
        contentContainerStyle={styles.flatListContainer}
       ListEmptyComponent={<Text style={[typography.body, styles.noDataText]}>No Product available</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation1.navigate('AddProducts')}>
        <Icon.Plus width={28} height={28} color={colors.white} />
      </TouchableOpacity>

      <Modal transparent visible={!!menuItem} animationType="fade" onRequestClose={() => setMenuItem(null)}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuItem(null)}>
          <View style={styles.menuSheet}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                const item = menuItem;
                setMenuItem(null);
                navigation.navigate("EditProduct", { ProductID: item.ProductID });
              }}
            >
              <Text style={[typography.body, styles.menuRowText]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                const item = menuItem;
                setMenuItem(null);
                setDeleteAlert({ visible: true, product: item });
              }}
            >
              <Text style={[typography.body, styles.menuRowDanger]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow} onPress={() => setMenuItem(null)}>
              <Text style={[typography.body, styles.menuRowText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ModalAlert
        visible={deleteAlert.visible}
        title="Confirm Deletion"
        message={deleteAlert.product ? `Are you sure you want to delete the product: ${deleteAlert.product.ProductName}?` : ''}
        cancelLabel="Cancel"
        onCancel={() => setDeleteAlert({ visible: false, product: null })}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onRequestClose={() => setDeleteAlert({ visible: false, product: null })}
      />
      <ModalAlert
        visible={resultAlert.visible}
        title={resultAlert.title}
        message={resultAlert.message}
        confirmLabel="OK"
        onConfirm={() => setResultAlert({ visible: false, title: '', message: '' })}
        onRequestClose={() => setResultAlert({ visible: false, title: '', message: '' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.space2,
    backgroundColor: colors.background,
  },
  flatListContainer: {
    paddingTop: spacing.headerHeight + spacing.space8,
    paddingBottom: spacing.space8,
  },
  noDataText: {
    color: colors.textGray,
    textAlign:'center'
  },
  productCard: {
    marginBottom: spacing.space3,
    marginHorizontal: spacing.space1,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: radius.md,
  },
  menuButton: {
    position: 'absolute',
    top: spacing.space3,
    right: spacing.space3,
  },
  productInfo: {
    marginTop: spacing.space3,
  },
  productName: {
    color: colors.textPrimary,
  },
  productCategory: {
    color: colors.textGray,
  },
  productDescription: {
    color: colors.textLight,
    marginVertical: spacing.space1,
  },
  productPrice: {
    color: colors.textPrimary,
  },
  productDiscount: {
    color: colors.danger,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: spacing.space5,
    bottom: spacing.space5,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    ...shadows.modal,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space5,
  },
  menuRow: {
    paddingVertical: spacing.space4,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundFaf,
  },
  menuRowText: {
    color: colors.textPrimary,
  },
  menuRowDanger: {
    color: colors.danger,
  },
});
