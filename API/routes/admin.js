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
        return res.status(202).json({ code: 202, message: "El alumno no existe"});
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
        return res.status(202).json({ code: 202, message: "El alumno no existe"});
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
        return res.status(202).json({ code: 202, message: "El docente no existe"});
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
        return res.status(202).json({ code: 202, message: "El docente no existe"});
    }
});

admin.post('/na', (req, res, next) => { // gets all info of student type users
    const consult = DB.prepare(`select userID, count(*) count from grades where status = 'NA' group by userID;`);
    const result = consult.all();

    const check = DB.prepare('select NAs from personalInfo where userID = ?')
    const update = DB.prepare('update personalInfo set NAs = ? where userID = ?')
    let changed = 0;

    for (var student of result) {
        let consult = check.all(student.userID)
        if (consult[0].NAs != student.count) {
            update.run(student.count, student.userID);
            changed++;
        }
    }

    return res.status(200).json({ code: 200, message: changed + " registros actualizados"});
});

module.exports = admin;