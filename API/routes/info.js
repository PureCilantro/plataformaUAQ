// Dependencies
const express = require('express');
const info = express.Router();
const DB = require('../config/database');

info.get('/:id([0-9]{6})', (req, res, next) => {
    const consult = DB.prepare('select name,last_name,semester,credits from personalInfo where userID = ?');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

info.get('/calif/:id([0-9]{6})', (req, res, next) => {
    const consult = DB.prepare('select s.name, g.sub_grade1, g.sub_grade2, g.sub_grade3, g.final_grade from grades g inner join subjects s on g.subjectID = s.subjectID where userID = ?;');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

info.get('/horario/:id([0-9]{6})', (req, res, next) => {
    const consult = DB.prepare('select sub.name, h.hours from schedules sch inner join subjects sub on sch.subjectID = sub.subjectID inner join hourBlocks h on sch.hourBlockID = h.hourBlockID where userID = ?;');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

module.exports = info;