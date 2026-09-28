import { supabase } from '../supabase';

// Replaces GET /Rider/:id.
export async function getRiderById(riderId) {
  const { data, error } = await supabase.from('Riders').select('*').eq('RiderID', riderId).single();
  if (error) throw error;
  return data;
}

// Replaces GET /Rider/assigned-order/:id.
export async function getAssignedOrder(riderId) {
  const { data, error } = await supabase
    .from('Riders')
    .select('AssignedOrder')
    .eq('RiderID', riderId)
    .single();
  if (error) throw error;
  return data.AssignedOrder;
}

// Replaces POST /Rider/ (RiderScreens/RiderRegister.js).
export async function createRider(fields) {
  const { data, error } = await supabase.from('Riders').insert(fields).select().single();
  if (error) throw error;
  return data;
}

// Replaces PUT /Rider/update/:id and PUT /Rider/Update/:id (both existed
// in the old routes with slightly different casing; this is the one path).
export async function updateRider(riderId, fields) {
  const { data, error } = await supabase
    .from('Riders')
    .update(fields)
    .eq('RiderID', riderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
