'use strict';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost/blog-app';

exports.DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
  pool: { min: 0, max: 2}, // elephantSQL
  debug: process.env.NODE_ENV === 'development' // resolves to true or false
};

exports.PORT = process.env.PORT || 8080; 