/**
 * File: config.js
 * Data: 09/03/2020
 * Description: Handling file to database connection locally 
 * Author: Germán Pla
 * 
 */
const { MongoClient } = require("mongodb");
const config = {
    url: "mongodb://localhost:27017/users",
    dbName: "users"
  };
  
  async function createConnection() {
    const connection = await MongoClient.connect(config.url, {
      useNewUrlParser: true
    });
    const db = connection.db(config.dbName);
    return {
      connection,
      db
    };
  }
  
  module.exports = createConnection;