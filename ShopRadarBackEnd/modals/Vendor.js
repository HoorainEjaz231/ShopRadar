const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('../modals/Product')
const Vendor = sequelize.define('Vendor', {
    VendorID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    BusinessName: { type: DataTypes.STRING, allowNull: false },
    CompanyAddress: { type: DataTypes.STRING, allowNull: false },
    City: { type: DataTypes.STRING, allowNull: false },
    StateProvince: { type: DataTypes.STRING, allowNull: false },
    Country: { type: DataTypes.STRING, allowNull: false },
    Latitude: { type: DataTypes.FLOAT },
    Longitude: { type: DataTypes.FLOAT },
    Contact: { type: DataTypes.STRING },
    Market: { type: DataTypes.STRING },
    Email: { type: DataTypes.STRING, unique: true, allowNull: false },
    ShopCategory: { type: DataTypes.STRING },
    Image: { type: DataTypes.STRING },

    
   
},{
    
        tableName: 'Vendors', // Ensure this matches your actual table name
        timestamps: false // This will automatically manage `createdAt` and `updatedAt` fields
    
}

);
Vendor.hasMany(Product, { foreignKey: 'VendorID' });
Product.belongsTo(Vendor, { foreignKey: 'VendorID' });
module.exports = Vendor;
