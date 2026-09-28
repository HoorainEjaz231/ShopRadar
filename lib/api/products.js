import { supabase } from '../supabase';

// Replaces GET /Product/:VendorID.
export async function getProductsByVendor(vendorId) {
  const { data, error } = await supabase.from('Products').select('*').eq('VendorID', vendorId);
  if (error) throw error;
  return data;
}

// Replaces GET /Product/Products/:productId.
export async function getProductById(productId) {
  const { data, error } = await supabase.from('Products').select('*').eq('ProductID', productId).single();
  if (error) throw error;
  return data;
}

// Replaces POST /Product/ (VendorAddProduct.js).
export async function createProduct(fields) {
  const { data, error } = await supabase.from('Products').insert(fields).select().single();
  if (error) throw error;
  return data;
}

// Replaces PUT /Product/updateProduct/:ProductID.
export async function updateProduct(productId, fields) {
  const { data, error } = await supabase
    .from('Products')
    .update(fields)
    .eq('ProductID', productId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Replaces DELETE /Product/deleteProduct/:ProductID.
export async function deleteProduct(productId) {
  const { error } = await supabase.from('Products').delete().eq('ProductID', productId);
  if (error) throw error;
}

// Replaces GET /Product/SearchProducts (CustomerScreens/SearchScreenModal.js).
// Market lives on the vendor, so it's filtered through the embedded,
// inner-joined Vendor row.
export async function searchProducts({ searchText, category, market }) {
  let query = supabase.from('Products').select('*, Vendor:Vendors!inner(*)');

  if (searchText) {
    query = query.ilike('ProductName', `%${searchText}%`);
  }
  if (category) {
    query = query.eq('ProductCategory', category);
  }
  if (market) {
    query = query.eq('Vendor.Market', market);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
