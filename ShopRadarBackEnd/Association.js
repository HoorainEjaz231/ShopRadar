// const Order = require('./modals/Order');
// const Vendor = require('./modals/Vendor');
// const OrderDetail = require('./modals/OrderDetail');

// // Define associations
// Order.belongsTo(Vendor, { foreignKey: 'VendorID' }); // Order belongs to Vendor
// Order.hasMany(OrderDetail, { foreignKey: 'OrderID' }); // Order has many OrderDetails
// OrderDetail.belongsTo(Order, { foreignKey: 'OrderID' }); // OrderDetail belongs to Order

// module.exports = { Order, Vendor, OrderDetail };


// associations.js
const Order = require('./modals/Order');
const Vendor = require('./modals/Vendor');
const OrderDetail = require('./modals/OrderDetail');
const Rating = require('./modals/Rating');
const Customer = require('./modals/Customer')
const Rider = require('./modals/Rider')

// Define associations
Order.belongsTo(Vendor, { foreignKey: 'VendorID' }); // Order belongs to Vendor
Order.hasMany(OrderDetail, { foreignKey: 'OrderID' }); // Order has many OrderDetails
OrderDetail.belongsTo(Order, { foreignKey: 'OrderID' }); // OrderDetail belongs to Order
Order.hasMany(Rating, { foreignKey: 'OrderID' }); // Order has many Ratings
Rating.belongsTo(Order, { foreignKey: 'OrderID' }); // Rating belongs to Order
Rating.belongsTo(Customer, { foreignKey: 'CustomerID' }); // Rating belongs to Customer


// Customer Assocciation

// In the Customer model
Customer.belongsTo(Vendor, { foreignKey: 'VendorID', as: 'vendor' });
Customer.belongsTo(Rider, { foreignKey: 'RiderID', as: 'rider' });

// In the Vendor model
Vendor.hasMany(Customer, { foreignKey: 'VendorID', as: 'customers' });

// In the Rider model
Rider.hasMany(Customer, { foreignKey: 'RiderID', as: 'customers' });

module.exports = { Order, Vendor, OrderDetail, Rating };
