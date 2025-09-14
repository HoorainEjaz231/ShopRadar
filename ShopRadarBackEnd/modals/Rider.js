const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the sequelize instance

const Rider = sequelize.define('Rider', {
    RiderID: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    Name: {type: DataTypes.STRING(100),allowNull: false},
    IDCardNumber: {type: DataTypes.STRING(50),allowNull: false},
    City: {type: DataTypes.STRING(100)},
    BikeNumber: { type: DataTypes.STRING(50)},
    LicenseImage: {type: DataTypes.STRING,allowNull: false,},
    IsAvailable: { type: DataTypes.BOOLEAN, defaultValue: true},
    RiderProfileImage: {type: DataTypes.STRING,allowNull: false,},
    Contact: { type: DataTypes.STRING , allowNull:false},
    AssignedOrder: {type: DataTypes.INTEGER, allowNull:true}
    
}, {
    tableName: 'Riders', // Specify the table name
    timestamps: false // Disable timestamps
});

module.exports = Rider;
