/**
 * File: CreateUser/index.js
 * Description: endpoint for creating a new 'User'
 * Date: 09/03/2020
 * Author: Germán Pla (https://github.com/germanps)
 */

 const createMongoClient = require("../config/config");
 const userModel = require("../models/User");
 const bcrypt = require('bcrypt-nodejs');


exports.default = async function (context, req) {
    const user = new userModel();
    const { name, lastname, email, password, repeatPassword } = req.body;
    
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;

    const { db, connection } = await createMongoClient();
    const Users = db.collection('users');

    if(!password || !repeatPassword){
        //Campos vacios
        context.res = {
            status: 400,
            body: 'User data is requires!'
        }
        connection.close();
        return;
    }else{
        if (password !== repeatPassword) {
            //contraseñas diferentes
            context.res = {
                status: 404,
                body: "Passwords are different"
            }
        }else{
            try {
                bcrypt.hash(password, null, null, async function(err, hash){
                    if(err){
                        context.res = {
                            status: 500,
                            body: "Error de servidor"
                        }
                    }

                    const allUsers = await Users.findOne({email: email});
                        
                    if (!allUsers) {
                        //si no hay registro con el mismo email insertamos en mongo
                        user.password = hash;
                        const users = await Users.insertOne(user);
                        connection.close();
                        context.res = {
                            status: 201,
                            body: users.ops[0]
                        } 
                    }else{
                        //usuario con email duplicado
                        context.res = {
                            status: 500,
                            body: "El usuario  ya está en la BBDD"
                        }
                    }       
                });
            } catch (error) {
                context.res = {
                    status: 500,
                    body: "Error creating a new user"
                }
            }
        }
    }
 }
