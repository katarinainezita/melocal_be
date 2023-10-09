import { Sequelize } from "sequelize";

const db = new Sequelize('melocaldb', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;