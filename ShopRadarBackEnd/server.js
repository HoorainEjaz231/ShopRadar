const express = require('express');
const bodyParser = require('body-parser');
// Set up Sequelize connection in a separate file
const routes = require('./routes/routes.js');
const CustomerRoutes = require('./routes/CustomerRoutes.js')
const vendorRoutes = require('./routes/VendorRoutes.js')
const RiderRoutes = require('./routes/RiderRoutes.js') 
const ProductRoutes = require('./routes/ProductRoutes.js')
const ordersRoutes = require('./routes/ordersRoutes.js')
const orderDetailsRoutes = require('./routes/orderDetailsRoutes.js')
const RatingRoutes = require('./routes/RatingRoutes.js')
const CustOrders = require('./routes/CustomerOrders.js')

const { Order, Vendor, OrderDetail, Rating, Rider } = require('./Association.js');
const app = express();

app.use(bodyParser.json());


app.use('/Customer', CustomerRoutes);
app.use('/vendor', vendorRoutes);
app.use('/Rider', RiderRoutes);
app.use('/Product', ProductRoutes);
app.use('/orders', ordersRoutes);
app.use('/orderdetails', orderDetailsRoutes);
app.use('/ratings', RatingRoutes);
app.use('/CustOrders', CustOrders);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
