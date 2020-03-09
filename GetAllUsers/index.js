/**
 * File: GetAllUsers/index.js
 * Description: endpoint for list all 'Users'
 * Date: 09/03/2020
 * Author: Germán Pla (https://github.com/germanps)
 */

const createMongoClient = require('../config/config');

module.exports = async function (context, req) {
    const { db, connection } = await createMongoClient();

    const Users = db.collection('users');
    const res = await Users.find({});
    const body = await res.toArray();
    connection.close();

    context.res = {
        status: 200,
        body
    }
}