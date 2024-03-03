require("dotenv").config();

const { Client } = require("pg");

const dbConfig = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

module.exports = dbConfig;
