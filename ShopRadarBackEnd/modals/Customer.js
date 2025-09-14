// models/Customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust the path as necessary

const Customer = sequelize.define('Customer', {
    CustomerID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    FullName: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, unique: true, allowNull: false },
    Phone: { type: DataTypes.STRING },
    Address: { type: DataTypes.STRING },
    City: { type: DataTypes.STRING },
    StateProvince: { type: DataTypes.STRING },
    Country: { type: DataTypes.STRING },
    VendorID: { type: DataTypes.STRING, allowNull: true },
    RiderID: { type: DataTypes.STRING, allowNull: true },
    Latitude: { type: DataTypes.FLOAT, allowNull: true },
    Longitude: { type: DataTypes.FLOAT, allowNull: true },
    AdminUser:{type: DataTypes.BOOLEAN}

}, {
    tableName: 'Customers', // Ensure this matches your actual table name
    timestamps: false // This will automatically manage `createdAt` and `updatedAt` fields
});

module.exports = Customer;
