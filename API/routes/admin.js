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
    const consult = DB.prepare(`select userID, name, semester from personalInfo where user_type = 'std' and userID = ?;`);
    const result = consult.all(req.params.id);

    if (result.length == 1) {
        return res.status(200).json({ code: 200, message: result});
    }
    else{
        return res.status(202).json({ code: 202, message: "El alumno no existe"});
    }
});

admin.put('/student', (req, res, next) => { // updates student information
    const { userID, name, semester } = req.body;

    if (userID && name && semester) {
        try {
            const update = DB.prepare('update personalInfo set name = ?, semester = ? where userID = ?;');
            const result = update.run(name,semester,userID);

            if (result.changes > 0) {
                return res.status(200).json({ code: 200, message: "Se actualizó con éxito"});
            } else {
                return res.status(202).json({ code: 202, message: "No se actualizó"});
            }
        } catch (error) {
            return res.status(400).json({ code: 400, message: "No se pudo actualizar el registro: " + error.message});
        }
    } else {
        return res.status(500).json({ code: 500, message: "Campos incompletos"});    
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

admin.put('/teacher', (req, res, next) => { // updates teacher information
    const { userID, name } = req.body;

    if (userID && name) {
        try {
            const update = DB.prepare('update personalInfo set name = ? where userID = ?;');
            const result = update.run(name,userID);

            if (result.changes > 0) {
                return res.status(200).json({ code: 200, message: "Se actualizó con éxito"});
            } else {
                return res.status(202).json({ code: 202, message: "No se actualizó"});
            }
        } catch (error) {
            return res.status(400).json({ code: 400, message: "No se pudo actualizar el registro: " + error.message});
        }
    } else {
        return res.status(500).json({ code: 500, message: "Campos incompletos"});    
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

    const check = DB.prepare('select NAs from personalInfo where userID = ?;')
    const update = DB.prepare('update personalInfo set NAs = ? where userID = ?;')
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

admin.get('/group', (req, res, next) => { // gets all registered groups
    const consult = DB.prepare('select groupNO grupo from groups group by groupNO;');
    const result = consult.all();

    return res.status(200).json({ code: 200, message: result});
});

admin.get('/group/:id([0-9]{2})', (req, res, next) => { // gets all students IDs and names from a group ID
    const consult = DB.prepare('select g.userID, p.name from groups g inner join personalInfo p on g.userID = p.userID where groupNO = ?;');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

admin.post('/group', (req, res, next) => { // creates a group of an array of stundent IDs
    const { group, users } = req.body;

    if (group && users) {
        try {
            const check = DB.prepare('select * from groups where groupNO = ?;').all(group);
            const insert = DB.prepare('insert into groups values (?,?)')

            if (check.length > 0) {
                for (var user of users) {
                    insert.run(user,group)
                }
                return res.status(200).json({ code: 200, message: "Se registro el grupo"});
            } else {
                return res.status(202).json({ code: 202, message: "El grupo ya existe"});
            }
        } catch (error) {
            return res.status(400).json({ code: 400, message: "No se pudo actualizar el registro: " + error.message});
        }
    } else {
        return res.status(500).json({ code: 500, message: "Campos incompletos"});    
    } 
});

admin.put('/group', (req, res, next) => { // creates a group of an array of stundent IDs
    const { group, users } = req.body;

    if (group && users) {
        try {
            const insert = DB.prepare('insert into groups values (?,?)')

            for (var user of users) {
                insert.run(user,group)
            }
            return res.status(200).json({ code: 200, message: "Se actializó el grupo"});
        } catch (error) {
            return res.status(400).json({ code: 400, message: "No se pudo actualizar el registro: " + error.message});
        }
    } else {
        return res.status(500).json({ code: 500, message: "Campos incompletos"});    
    } 
});

admin.delete('/group', (req, res, next) => { // deletes all users from a group
    const { group } = req.body;

    if (group) {
        try {
            const check = DB.prepare('select * from groups where groupNO = ?;').all(group);
            const begone = DB.prepare('delete from groups where groupNO = ?;')

            if (check.length == 1) {
                begone.run(group);
                return res.status(200).json({ code: 200, message: "Se borró el grupo"});
            } else {
                return res.status(202).json({ code: 202, message: "El grupo no existe"});
            }
        } catch (error) {
            return res.status(400).json({ code: 400, message: "No se pudo actualizar el registro: " + error.message});
        }
    } else {
        return res.status(500).json({ code: 500, message: "Campos incompletos"});    
    } 
});

module.exports = admin;