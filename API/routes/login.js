// Dependencies
const express = require('express');
const login = express.Router();
const DB = require('../config/database');

login.post('/', (req, res, next) => { // Checks for user_name & user_password in db
    const {user_name, user_password} = req.body;
    
    if (user_name && user_password ) {
        const consult = DB.prepare('select user_level from users where user_name = ? and user_password = ?');
        const result = consult.all(user_name, user_password);

        if (result.length == 1) {
            return res.status(200).json({ code: 200, message: result});
        }
        else{
            return res.status(400).json({ code: 400, message: "Usuario y/o contraseña incorrecta"});   
        }
    }
    else{
        return res.status(500).json({ code: 500, message: "Campos incompletos"});
    }    
})

module.exports = login;