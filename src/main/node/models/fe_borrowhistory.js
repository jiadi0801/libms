'use strict';
module.exports = (sequelize, DataTypes) => {
    var BorHis = sequelize.define('fe_borrowhistory', {
        id: {type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true},
        borrower: {type: DataTypes.STRING(30), allowNull: false},
        bor_time: {type: DataTypes.DATE},
        book_id: {type: DataTypes.BIGINT, allowNull: false},
        erp: {type: DataTypes.STRING(30)},
        back_time: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		}
    }, {
        timestamps: false,
        freezeTableName: true
    })
    return BorHis;
}
