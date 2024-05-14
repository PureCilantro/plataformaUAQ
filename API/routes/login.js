// Dependencies
const express = require('express');
const login = express.Router();
const DB = require('../config/database');

// Checks for user_name & user_password in db
login.post('/', (req, res, next) => { 
    const {user_name, user_password} = req.body;
    
    if (user_name && user_password ) {
        const consult = DB.prepare('select * from users where user_name = ? and user_password = ?');
        const result = consult.all(user_name, user_password);

        if (result.length == 1) {
            return res.status(200).json({ code: 200 });
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