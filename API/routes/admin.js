// Dependencies
const express = require('express');
const admin = express.Router();
const DB = require('../config/database');

admin.get('/student', (req, res, next) => { // gets all info of student type users
    const consult = DB.prepare(`select userID, name from personalInfo where user_type = 'std';`);
    const result = consult.all();

    return res.status(200).json({ code: 200, message: result});
});

admin.get('/student/:id([0-9]{6})', (req, res, next) => { // searches for a student by id
    const consult = DB.prepare(`select userID, name from personalInfo where user_type = 'std' and userID = ?;`);
    const result = consult.all(req.params.id);

    if (result.length == 1) {
        return res.status(200).json({ code: 200, message: result});
    }
    else{
        return res.status(202).json({ code: 202, message: "No existe el alumno"});
    }
});

admin.get('/student/:name([A-Za-z]+)', (req, res, next) => { // searches for a student by name
    var nameToSearch = "%" + req.params.name + "%";
    const consult = DB.prepare(`select userID, name from personalInfo where user_type = 'std' and name like ?;`);
    const result = consult.all(nameToSearch);

    if (result.length == 1) {
        return res.status(200).json({ code: 200, message: result});
    }
    else{
        return res.status(202).json({ code: 202, message: "No existe el alumno"});
    }
});

admin.get('/teacher', (req, res, next) => { // gets all info of teacher type users
    const consult = DB.prepare(`select userID, name from personalInfo where user_type = 'pro';`);
    const result = consult.all();

    return res.status(200).json({ code: 200, message: result});
});

admin.get('/teacher/:id([0-9]{6})', (req, res, next) => { // searches for a teacher by id
    const consult = DB.prepare(`select userID, name from personalInfo where user_type = 'pro' and userID = ?;`);
    const result = consult.all(req.params.id);

    if (result.length == 1) {
        return res.status(200).json({ code: 200, message: result});
    }
    else{
        return res.status(202).json({ code: 202, message: "No existe el docente"});
    }
});

admin.get('/teacher/:name([A-Za-z]+)', (req, res, next) => { // searches for a teacher by name
    var nameToSearch = "%" + req.params.name + "%";
    const consult = DB.prepare(`select userID, name from personalInfo where user_type = 'pro' and name like ?;`);
    const result = consult.all(nameToSearch);

    if (result.length == 1) {
        return res.status(200).json({ code: 200, message: result});
    }
    else{
        return res.status(202).json({ code: 202, message: "No existe el alumno"});
    }
});

module.exports = admin;