const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  OrderID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  CustomerID: { type: DataTypes.INTEGER, allowNull: false },
  VendorID: { type: DataTypes.INTEGER, allowNull: false },
  RiderID: { type: DataTypes.INTEGER, allowNull:true},
  OrderPrice: { type: DataTypes.INTEGER, allowNull:false},
  DeliveryFee: { type: DataTypes.INTEGER, allowNull:false},
  OrderDate: { type: DataTypes.DATEONLY, allowNull: false },
  DeliveryAddress: { type: DataTypes.STRING, allowNull: false },
  OrderStatus: { type: DataTypes.STRING, allowNull: false },
  DeliveryType: { type: DataTypes.STRING, allowNull: false },
  isDelivered: { type: DataTypes.BOOLEAN, defaultValue: false },
  VanAccept: { type: DataTypes.BOOLEAN},
  CustLatitude: { type: DataTypes.BOOLEAN, allowNull:true, defaultValue: false },
  CustLongitude: { type: DataTypes.BOOLEAN, allowNull:true,  defaultValue: false },
}, {
  tableName: 'Orders',
  timestamps: false
});


module.exports = Order;
