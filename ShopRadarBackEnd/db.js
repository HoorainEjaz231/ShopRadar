const { Sequelize } = require('sequelize');

const db = new Sequelize('ShopRadarDB', "sa", "shop", {
    host: 'DESKTOP-EGGC7RM', // Server name
    dialect: 'mssql',
    dialectOptions: {
        options: {
            trustedConnection: true, // Windows Authentication
            encrypt: true,
            enableArithAbort: true,
            instanceName: 'SQLEXPRESS' // Named instance
        }
    }
});


db.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = db;


