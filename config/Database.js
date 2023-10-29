import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

const db = new Sequelize(
  database, username, password,
  {
    host: host,
    port: port,
    dialect: "mysql"
  }
)
export default db;