import { supabase } from '../supabase';

// Replaces GET /vendor/vendors.
export async function getVendors() {
  const { data, error } = await supabase.from('Vendors').select('*');
  if (error) throw error;
  return data;
}

// Replaces GET /vendor/:id.
export async function getVendorById(vendorId) {
  const { data, error } = await supabase.from('Vendors').select('*').eq('VendorID', vendorId).single();
  if (error) throw error;
  return data;
}

// Replaces POST /vendor/ (VendorScreens/VendorRegister.js).
export async function createVendor(fields) {
  const { data, error } = await supabase.from('Vendors').insert(fields).select().single();
  if (error) throw error;
  return data;
}

// Replaces PUT /vendor/update/:id (EDITComponent/EditVendor.js).
export async function updateVendor(vendorId, fields) {
  const { data, error } = await supabase
    .from('Vendors')
    .update(fields)
    .eq('VendorID', vendorId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
