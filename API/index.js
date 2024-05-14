//Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
//Routers
const login = require('./routes/login');
const info = require('./routes/info');
const teacher = require('./routes/teacher');
const admin = require('./routes/admin');
//Middleware
const authLevel2 = require('./middleware/authLevel2');
const authLevel1 = require('./middleware/authLevel1');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true})); 

// API endpoints
app.use('/login', login);

app.use('/info', info);

app.use(authLevel2);

app.use('/teacher', teacher);

app.use(authLevel1);

app.use('/admin', admin);

// Server status
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
})