import { supabase } from '../supabase';

// Replaces AuthScreens/SignUp.js's POST /Customer/signup. The "Customers"
// row itself is created server-side by the on_auth_user_created trigger
// (see the auto_create_customer_on_signup migration) using the profile
// fields passed as auth user metadata — this works whether or not the
// project requires email confirmation, since a client-side insert would be
// blocked by RLS until a session exists.
export async function signUp({ FullName, Email, Phone, Address, City, StateProvince, Country, Password }) {
  const { data, error } = await supabase.auth.signUp({
    email: Email,
    password: Password,
    options: {
      data: { FullName, Phone, Address, City, StateProvince, Country },
    },
  });
  if (error) throw error;

  // No session means the project requires email confirmation — the
  // Customers row still gets created by the trigger, but the caller can't
  // fetch it yet (no auth.uid()) until the user confirms and logs in.
  if (!data.session) {
    return { session: null, customer: null };
  }

  const customer = await getCustomerByAuthUser();
  return { session: data.session, customer };
}

// Replaces AuthScreens/Login.js's POST /Customer/login.
export async function signIn({ Email, Password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: Email, password: Password });
  if (error) throw error;

  const customer = await getCustomerByAuthUser();
  return { session: data.session, customer };
}

// Replaces Navigations/ViewProfile.js's AsyncStorage.removeItem('user').
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Fetches the "Customers" row for whoever is currently signed in — this is
// the shape cached into AsyncStorage['user'] everywhere in the app.
export async function getCustomerByAuthUser() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('Customers')
    .select('*')
    .eq('AuthUserID', userData.user.id)
    .single();
  if (error) throw error;
  return data;
}

// Replaces GET /Customer/:id.
export async function getCustomerById(customerId) {
  const { data, error } = await supabase.from('Customers').select('*').eq('CustomerID', customerId).single();
  if (error) throw error;
  return data;
}

// Replaces PUT /Customer/update/:id (EDITComponent/EditCustomer.js).
export async function updateCustomer(customerId, fields) {
  const { data, error } = await supabase
    .from('Customers')
    .update(fields)
    .eq('CustomerID', customerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Replaces GET /Customer/Customers/all (Admin/CustomerManagement.js),
// embedding Vendor/Rider the same way the old Sequelize `include` did.
export async function getAllCustomersWithRoles() {
  const { data, error } = await supabase
    .from('Customers')
    .select('*, vendor:Vendors(VendorID,BusinessName,Market), rider:Riders(RiderID,Name,BikeNumber)');
  if (error) throw error;
  return data;
}

// Replaces DELETE /customers/delete/:id (Admin/CustomerManagement.js) —
// the old route didn't actually exist (mismatched path prefix), so this
// button previously 404'd; it works now.
export async function deleteCustomer(customerId) {
  const { error } = await supabase.from('Customers').delete().eq('CustomerID', customerId);
  if (error) throw error;
}
