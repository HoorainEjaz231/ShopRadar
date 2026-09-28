import { supabase } from '../supabase';

// Replaces POST /ratings/ (CustomerScreens/Orders.js's submitRating).
export async function createRating({ CustomerID, VendorID, OrderID, Rating }) {
  const { data, error } = await supabase
    .from('Ratings')
    .insert({ CustomerID, VendorID, OrderID, Rating })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Replaces GET /ratings/allRating (Admin/AdminHome.js).
export async function getAllRatings() {
  const { data, error } = await supabase.from('Ratings').select('*');
  if (error) throw error;
  return data;
}
