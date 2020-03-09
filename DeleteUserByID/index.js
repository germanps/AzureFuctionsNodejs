/**
 * File: GetAllDishesByID/index.js
 * Description: endpoint for delete a 'User' by ID
 * Date: 09/03/2020
 * Author: Germán Pla (https://github.com/germanps)
 */

 const { ObjectID } = require("mongodb");
 const createMongoClient = require("../config/config");

 module.exports = async function(context, req) {
    const { id } = req.params;
    if (!id) {
        context.res = {
            status: 400,
            body: "ID are required"
        }
        return;
    }
    const { db, connection } = await createMongoClient();
    const Users = db.collection("users");

    try {
        await Users.findOneAndDelete({ _id: ObjectID(id) });
        connection.close();
        context.res = {
            status: 200,
            body: "User deleted successfully"
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error deleting user" + id
        }
    }
 }
