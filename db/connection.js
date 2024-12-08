const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const config = {};

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
  config.ssl = {
    rejectUnauthorized: false // This tells pg to bypass strict certificate verification (needed for Supabase)
  };
}
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}
// console.log(config)
module.exports = new Pool(config);