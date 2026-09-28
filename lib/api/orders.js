import moment from 'moment';
import { supabase } from '../supabase';

// Replaces POST /orders/ (CustomerScreens/CartScreen.js's handlePlaceOrder).
export async function createOrder(fields) {
  const { data, error } = await supabase.from('Orders').insert(fields).select().single();
  if (error) throw error;
  return data;
}

// Replaces GET /orders/:id.
export async function getOrderById(orderId) {
  const { data, error } = await supabase.from('Orders').select('*').eq('OrderID', orderId).single();
  if (error) throw error;
  return data;
}

// Replaces PUT /orders/:id — every order-status transition (accept,
// decline/cancel, mark picked up, mark delivered, assign a rider) goes
// through this one function, same as the old generic PUT route.
export async function updateOrder(orderId, fields) {
  const { data, error } = await supabase
    .from('Orders')
    .update(fields)
    .eq('OrderID', orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Replaces GET /orders/customer/:customerId (CustomerScreens/HomeScreen.js
// pending-orders badge, CustomerScreens/PendingOrders.js's in-progress list).
export async function getActiveOrdersForCustomer(customerId) {
  const { data, error } = await supabase
    .from('Orders')
    .select('*, Vendor:Vendors(BusinessName,Image,Latitude,Longitude,Contact,Market,CompanyAddress)')
    .eq('CustomerID', customerId)
    .in('OrderStatus', ['pending', 'accepted', 'PickedUp', 'AtVendor', 'PickUp']);
  if (error) throw error;
  return data;
}

// Replaces GET /orders/customer-orders/:CustomerID (CustomerScreens/Orders.js).
export async function getOrderHistoryForCustomer(customerId) {
  const { data, error } = await supabase
    .from('Orders')
    .select('*, Vendor:Vendors(BusinessName,Image), OrderDetail:OrderDetails(OrderDetailID,ProductDetails), Rating:Ratings(Rating,RatingDate)')
    .eq('CustomerID', customerId)
    .in('OrderStatus', ['Delivered', 'Cancelled']);
  if (error) throw error;
  // Match the old Sequelize `include` shape: Orders.js reads `Ratings`
  // (plural) off each order.
  return data.map((order) => ({ ...order, Ratings: order.Rating ?? [] }));
}

// Replaces GET /orders/upcoming/:vendorId (VendorScreens/VendorHome.js).
export async function getUpcomingOrdersForVendor(vendorId) {
  const { data, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('VendorID', vendorId)
    .neq('OrderStatus', 'PickedUP');
  if (error) throw error;
  return data;
}

// Replaces GET /orders/all (RiderScreens/RiderHome.js) — unassigned orders
// any available rider can accept. RLS's "available riders" clause is what
// actually lets a rider see rows where RiderID is still null.
export async function getAvailableOrdersForRiders() {
  const { data, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('OrderStatus', 'pending')
    .eq('VanAccept', true);
  if (error) throw error;
  return data;
}

// Replaces GET /orders/admin/allOrders (Admin/AdminHome.js, Admin/ManageOrders.js).
export async function getAllOrdersAdmin() {
  const { data, error } = await supabase.from('Orders').select('*');
  if (error) throw error;
  return data;
}

// Buckets a list of orders into { today, tomorrow, others, incomes } exactly
// like the old ordersRoutes.js did with moment — shared by VendorIncome and
// RiderIncome below, which only differ in which orders/amount field feed it.
function groupOrdersByDate(orders, amountField) {
  const today = moment().startOf('day');
  const tomorrow = moment().add(1, 'days').startOf('day');
  const grouped = { today: [], tomorrow: [], others: {}, incomes: {} };

  orders.forEach((order) => {
    const orderDate = moment(order.OrderDate).startOf('day');
    const dateString = orderDate.format('DD/MM/YYYY');

    if (amountField(order) !== null) {
      grouped.incomes[dateString] = (grouped.incomes[dateString] || 0) + amountField(order);
    }

    if (orderDate.isSame(today, 'day')) {
      grouped.today.push(order);
    } else if (orderDate.isSame(tomorrow, 'day')) {
      grouped.tomorrow.push(order);
    } else {
      if (!grouped.others[dateString]) grouped.others[dateString] = [];
      grouped.others[dateString].push(order);
    }
  });

  return grouped;
}

// Replaces GET /orders/VendorIncome/:VendorID.
export async function getVendorIncome(vendorId) {
  const { data, error } = await supabase
    .from('Orders')
    .select('OrderID,DeliveryAddress,OrderStatus,OrderPrice,OrderDate')
    .eq('VendorID', vendorId)
    .in('OrderStatus', ['Delivered', 'Cancelled'])
    .order('OrderDate', { ascending: false });
  if (error) throw error;

  return groupOrdersByDate(data, (order) => (order.OrderStatus === 'Delivered' ? order.OrderPrice : null));
}

// Replaces GET /orders/RiderIncome/:RiderID.
export async function getRiderIncome(riderId) {
  const { data, error } = await supabase
    .from('Orders')
    .select('OrderID,DeliveryAddress,OrderStatus,DeliveryFee,OrderDate')
    .eq('RiderID', riderId)
    .eq('OrderStatus', 'Delivered')
    .order('OrderDate', { ascending: false });
  if (error) throw error;

  return groupOrdersByDate(data, (order) => order.DeliveryFee);
}
