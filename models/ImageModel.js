import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Activities from "./ActivityModel.js";

const {DataTypes} = Sequelize;

const Images = db.define('images', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    url: {
      type: DataTypes.TEXT,
      validate:{
        isUrl: true
      }
    }
}, {
    freezeTableName: true
});

Activities.hasMany(Images);
Images.belongsTo(Activities);

export default Images;