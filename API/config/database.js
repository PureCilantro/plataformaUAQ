// Initialize db conection using better-sqlite cause its better duh
const sql = require('better-sqlite3');

const dbconnection = new sql('./database/db.sqlite', {});

// Ultra fast performance mode
dbconnection.pragma('journal_mode = WAL');

module.exports = dbconnection;