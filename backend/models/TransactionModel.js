import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const {DataTypes} = Sequelize;

const Transactions = db.define('transactions', {
    waktu: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    metode_pembayaran: DataTypes.ENUM(['ovo', 'gopay', 'dana', 'shopeepay', 'transfer']),
    harga_total: DataTypes.INTEGER,
    status: DataTypes.ENUM(['menunggu pembayaran', 'akan datang', 'telah selesai', 'batal'])
}, {
    freezeTableName: true
});

Users.hasMany(Transactions);
Transactions.belongsTo(Users)

export default Transactions;
