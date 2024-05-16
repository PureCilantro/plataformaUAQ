// Dependencies
const express = require('express');
const teacher = express.Router();
const DB = require('../config/database');

teacher.get('/', (req, res, next) => { // gets all groups for a given teacher id
    const consult = DB.prepare('select sc.subjectID, sc.grupo, su.name, h.hours, sc.croom from schedules sc inner join subjects su on sc.subjectID = su.subjectID inner join hourBlocks h on sc.hourBlockID = h.hourBlockID where teacherID = ? group by grupo');
    const result = consult.all(req.headers.user);

    return res.status(200).json({ code: 200, message: result});
});

teacher.get('/:group([0-9]{1,2})', (req, res, next) => { // gets all students for a given group number
    const consult = DB.prepare('select s.userID, p.name from schedules s inner join personalInfo p on s.userID = p.userID where grupo = ?;');
    const result = consult.all(req.params.group);

    return res.status(200).json({ code: 200, message: result});
});

teacher.get('/horario/:id([0-9]{6})', (req, res, next) => { // gets all schedule information for a given teacher id
    const consult = DB.prepare('select sch.grupo, sub.name, h.hours, sch.days, sch.croom from schedules sch inner join subjects sub on sch.subjectID = sub.subjectID inner join hourBlocks h on sch.hourBlockID = h.hourBlockID where teacherID = ? group by grupo;');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

teacher.put('/', (req, res, next) => { // updates grades for a given student id
    const { sub1, sub2, sub3, final, exp, subject } = req.body;

    if (sub1 && sub2 && sub3 && final && exp && subject) {
        try {
            const consult = DB.prepare('update grades set sub_grade1 = ?, sub_grade2 = ?, sub_grade3 = ?, final_grade = ? where userID = ? and subjectID = ?');
            const result = consult.run(sub1, sub2, sub3, final, exp, subject);

            if (result.changes > 0) {
                return res.status(200).json({ code: 200, message: "El registro ha sido actualizado"});
            } else {
                return res.status(200).json({ code: 200, message: "No se actualizo ningun registro"});
            }
        } catch (error) {
            return res.status(400).json({ code: 400, message: "No se pudo actualizar el registro: " + error.message});
        }
    } else {
        return res.status(500).json({ code: 500, message: "Campos incompletos"});    
    } 
});

module.exports = teacher;