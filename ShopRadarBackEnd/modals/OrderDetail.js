const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const OrderDetail = sequelize.define('OrderDetail', {
  OrderDetailID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  OrderID: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  ProductDetails: { 
    type: DataTypes.STRING, // Adjust the type if necessary
    allowNull: true // Adjust the allowNull constraint based on your requirements
  }
}, {
  tableName: 'OrderDetails',
  timestamps: false
});

module.exports = OrderDetail;
