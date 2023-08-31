import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Sesis from "./SesiModel.js";
import Transactions from "./TransactionModel.js";

const {DataTypes} = Sequelize;

const Detail_transactions = db.define('detail_transactions', {
    jumlah: DataTypes.INTEGER
}, {
    freezeTableName: true
});

Transactions.hasMany(Detail_transactions);
Detail_transactions.belongsTo(Transactions);

Sesis.hasMany(Detail_transactions)
Detail_transactions.belongsTo(Sesis)

export default Detail_transactions;