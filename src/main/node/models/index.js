const dbconfig = require('../../resources/config/db').mysql;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbconfig.dbname, dbconfig.username, dbconfig.password, {
    host: dbconfig.host,
    dialect: 'mysql',
    port: dbconfig.port
});

const BookInfo = require('./fe_bookinfo')(sequelize, Sequelize.DataTypes);
const BorHis = require('./fe_borrowhistory')(sequelize, Sequelize.DataTypes);

module.exports ={
    sequelize: sequelize,
    Sequelize: Sequelize,
    BookInfo: BookInfo,
    BorHis: BorHis
}