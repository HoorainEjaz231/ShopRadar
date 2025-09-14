const { DataTypes } = require('sequelize');
const db = require('../db'); // Adjust the path as necessary
const { DateTime } = require('msnodesqlv8');

const Rating = db.define('Rating', {
  RatingID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  VendorID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  RatingDate: {
    type: DataTypes.DATE, // Use DATE to include date and time
    allowNull: true,
  },
  OrderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true 
  }
}, {
  tableName: 'Ratings',
  timestamps: false // Disable if not used in your table
});

module.exports = Rating;
