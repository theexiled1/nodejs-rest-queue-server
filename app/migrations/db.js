const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];
const {Pool} = require('pg');

const pool = new Pool({
  user: config.db.username,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});

const queries = {
  dropTable: 'DROP TABLE IF EXISTS job',
  dropFunction: 'DROP FUNCTION IF EXISTS update_timestamp()',
  dropTypeJobStatus: 'DROP TYPE IF EXISTS job_status',
  dropTypeJobType: 'DROP TYPE IF EXISTS job_type',
  createTypeJobStatus: 'CREATE TYPE job_status AS ENUM (\'waiting\', \'pending\',\'complete\')',
  createTypeJobType: 'CREATE TYPE job_type AS ENUM (\'feature\',\'hotfix\',\'deploy\')',
  createFunction: 'CREATE OR REPLACE FUNCTION update_timestamp()\n' +
  'RETURNS TRIGGER AS $$\n' +
  'BEGIN\n' +
  '   NEW.modified = now();\n' +
  '   RETURN NEW;\n' +
  'END;\n' +
  '$$ language \'plpgsql\'',
  createTrigger: 'CREATE TRIGGER queue BEFORE UPDATE\n' +
  'ON job FOR EACH ROW EXECUTE PROCEDURE\n' +
  'update_timestamp()',
  createTable: 'CREATE TABLE job (\n' +
  '  job_id SERIAL PRIMARY KEY,\n' +
  '  title TEXT,\n' +
  '  description TEXT,\n' +
  '  created timestamp without time zone,\n' +
  '  modified timestamp without time zone,\n' +
  '  type job_type,\n' +
  '  status job_status\n' +
  ')',
};

pool.connect((err, client, done) => {
  'use strict';

  let dropTable = () => client.query(queries.dropTable, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.dropTable + ' - ok');
  });

  let dropFunction = () => client.query(queries.dropFunction, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.dropFunction + ' - ok');
  });

  let dropTypeJobStatus = () => client.query(queries.dropTypeJobStatus, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.dropTypeJobStatus + ' - ok');
  });

  let dropTypeJobType = () => client.query(queries.dropTypeJobType, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.dropTypeJobType + ' - ok');
  });

  let createTypeJobType = () => client.query(queries.createTypeJobType, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.createTypeJobType + ' - ok');
  });

  let createTypeJobStatus = () => client.query(queries.createTypeJobStatus, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.createTypeJobStatus + ' - ok');
  });

  let createFunction = () => client.query(queries.createFunction, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.createFunction + ' - ok');
  });

  let createTable = () => client.query(queries.createTable, (err) => {
    if (err) {
      return console.error('Error running query', err);
    }
    console.log(queries.createTable + ' - ok');
    client.end();
  });

  var allPromise = Promise.all([
    dropTable(),
    dropFunction(),
    dropTypeJobStatus(),
    dropTypeJobType(),
    createTypeJobType(),
    createTypeJobStatus(),
    createFunction(),
    createTable()
  ]);
  allPromise.then(done);
});