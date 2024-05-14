// Dependencies
const DB = require('../config/database');

module.exports = (req, res, next) => {
    const consult = DB.prepare(`select user_level from users where userID = ?;`);
    const result = consult.all(req.headers.user);
    console.log('lvl2? ');
    console.log(result);

    if (result.length == 1 && result[0].user_level <= 2) {
        next();
    }
    else{
        return res.status(401).json({ code: 401, message: "No tienes permiso"});
    }
}