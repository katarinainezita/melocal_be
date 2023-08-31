import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Sesis from "./SesiModel.js";

const {DataTypes} = Sequelize;

const Carts = db.define('carts', {
}, {
    freezeTableName: true
});

Users.hasMany(Carts);
Carts.belongsTo(Users);

Sesis.hasMany(Carts);
Carts.belongsTo(Sesis);

export default Carts;