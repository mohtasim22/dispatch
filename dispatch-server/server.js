require('dotenv').config();            // must run BEFORE anything reads process.env
const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');   // wired up in the data slice

async function start() {
  await connectDB();                // uncomment once Atlas is set up
  app.listen(config.port, () => {
    console.log(`🚀 Dispatch server on port ${config.port}`);
  });
}

start();
