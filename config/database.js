const { createPool } = require("mysql");

const mysql = require("mysql");

const pool = createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 10,
  multipleStatements: true,
  ssl: true,
});

module.exports = pool;