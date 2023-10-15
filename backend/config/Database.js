import { Sequelize } from "sequelize";

const db = new Sequelize('melocal', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;