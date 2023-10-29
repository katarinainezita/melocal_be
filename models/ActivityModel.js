import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const {DataTypes} = Sequelize;

const Activities = db.define('activities', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
      },
    nama:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    deskripsi:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    harga:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    fitur:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    bintang:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lokasi:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    nama_tourguide: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
    },
    kontak_tourguide: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          is: /^[0-9]+$/
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Activities);
Activities.belongsTo(Users);

export default Activities;
