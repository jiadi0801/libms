'use strict';
module.exports = (sequelize, DataTypes) => {
    var BookInfo = sequelize.define('fe_bookinfo', {
        id: {type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true},
        num: {type: DataTypes.INTEGER},
        name: {type: DataTypes.STRING(500)},
        author: {type: DataTypes.STRING(500)},
        press: {type: DataTypes.STRING(100)},
        isbn: {type: DataTypes.STRING(20)},
        link: {type: DataTypes.STRING(1000)},
        store_time: {type: DataTypes.DATE}
    }, {
        timestamps: false,
        freezeTableName: true
    })
    return BookInfo;
}
