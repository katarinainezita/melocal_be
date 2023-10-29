import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('users', {
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
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    no_telp:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[0-9]+$/
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    melocal_points:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

export default Users;
