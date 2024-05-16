// Dependencies
const express = require('express');
const info = express.Router();
const DB = require('../config/database');

info.get('/:id([0-9]{6})', (req, res, next) => { // gets all personal info for a given user id
    const consult = DB.prepare('select name,semester,credits from personalInfo where userID = ?');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

info.get('/calif/', (req, res, next) => { // gets all grades of active subjects for a given user id
    const consult = DB.prepare(`select g.subjectID, s.name, g.sub_grade1 sub1, g.sub_grade2 sub2, g.sub_grade3 sub3, g.final_grade final from grades g inner join subjects s on g.subjectID = s.subjectID where userID = ? and status = 'CU';`);
    const result = consult.all(req.headers.user);

    return res.status(200).json({ code: 200, message: result});
});

info.get('/calif/:id([0-9]{6})', (req, res, next) => { // gets all grades for a given user id
    const consult = DB.prepare('select g.subjectID, s.name, g.sub_grade1, g.sub_grade2, g.sub_grade3, g.final_grade from grades g inner join subjects s on g.subjectID = s.subjectID where userID = ?;');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

info.get('/calif/:id([0-9]{6})/:subid([0-9])', (req, res, next) => { // gets all grades for a given student and subject id
    const consult = DB.prepare('select g.sub_grade1 sub1, g.sub_grade2 sub2, g.sub_grade3 sub3, g.final_grade final from grades g inner join subjects s on g.subjectID = s.subjectID where userID = ? and g.subjectID = ?;');
    const result = consult.all(req.params.id, req.params.subid);

    return res.status(200).json({ code: 200, message: result});
});

info.get('/horario/:id([0-9]{6})', (req, res, next) => { // gets all schedule information for a given student id
    const consult = DB.prepare('select sub.name, h.hours from schedules sch inner join subjects sub on sch.subjectID = sub.subjectID inner join hourBlocks h on sch.hourBlockID = h.hourBlockID where userID = ?;');
    const result = consult.all(req.params.id);

    return res.status(200).json({ code: 200, message: result});
});

module.exports = info;