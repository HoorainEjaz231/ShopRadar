const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Product = sequelize.define('Product', {
  ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  VendorID: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  ProductName: {
      type: DataTypes.STRING(100),
      allowNull: false
  },
  ProductCategory: {
      type: DataTypes.STRING(100)
  },
  Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
  },
  Image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
          min: 0,
          max: 100
      }
  },
  ProductDescription: {
      type: DataTypes.STRING(255)
  }
},{
  tableName: 'Products', // Specify the table name
    timestamps: false // Disable timestamps
});


module.exports = Product;
