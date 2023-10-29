import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Activities from "./ActivityModel.js";
const {DataTypes} = Sequelize;

const Sesis = db.define('sesis', {
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
    tanggal: DataTypes.DATEONLY,
    mulai: DataTypes.TIME,
    selesai: DataTypes.TIME,
    slot_maks: DataTypes.INTEGER,
    slot_booked: DataTypes.INTEGER
}, {
    freezeTableName: true
});

Activities.hasMany(Sesis);
Sesis.belongsTo(Activities);

export default Sesis;