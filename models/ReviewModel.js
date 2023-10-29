import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Activities from "./ActivityModel.js";


const {DataTypes} = Sequelize;

const Reviews = db.define('reviews', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
      },
    bintang: DataTypes.INTEGER,
    pesan: DataTypes.TEXT
}, {
    freezeTableName: true
});

Users.hasMany(Reviews);
Reviews.belongsTo(Users);

Activities.hasMany(Reviews);
Reviews.belongsTo(Activities)


export default Reviews;