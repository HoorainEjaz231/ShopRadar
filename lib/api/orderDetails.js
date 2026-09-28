import { supabase } from '../supabase';

// Replaces GET /orderdetails/:orderId/details. ProductDetails is jsonb, so
// callers get a real JS object/array back — no JSON.parse needed.
export async function getOrderDetails(orderId) {
  const { data, error } = await supabase.from('OrderDetails').select('*').eq('OrderID', orderId);
  if (error) throw error;
  return data;
}

// Replaces POST /orderdetails/. productDetails is passed as a plain object
// (e.g. { products: [...] }) — no JSON.stringify needed.
export async function createOrderDetails(orderId, productDetails) {
  const { data, error } = await supabase
    .from('OrderDetails')
    .insert({ OrderID: orderId, ProductDetails: productDetails })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Replaces PUT /orderdetails/update/:OrderDetailID.
export async function updateOrderDetails(orderDetailId, productDetails) {
  const { data, error } = await supabase
    .from('OrderDetails')
    .update({ ProductDetails: productDetails })
    .eq('OrderDetailID', orderDetailId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
