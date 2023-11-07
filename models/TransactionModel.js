import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Sesi from "./SesiModel.js";

const {DataTypes} = Sequelize;

const Transactions = db.define('transactions', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    waktu: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    metode_pembayaran: DataTypes.ENUM(['ovo', 'gopay', 'dana', 'shopeepay', 'transfer']),
    harga_total: DataTypes.INTEGER,
    status: DataTypes.ENUM(['menunggu pembayaran', 'menunggu verifikasi', 'terverifikasi', 'selesai', 'batal']),
    bukti_pembayaran: DataTypes.STRING,
    slot_dibeli: DataTypes.INTEGER
}, {
    freezeTableName: true
});

Users.hasMany(Transactions);
Sesi.hasMany(Transactions);
Transactions.belongsTo(Users);
Transactions.belongsTo(Sesi);

export default Transactions;
