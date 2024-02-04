const express = require('express');
const studentsRouter = require('./routers/studentsRouter');
const testRouter = require('./routers/testRouter');
const studentToTestRouter = require('./routers/studentToTestRouter');
const subjectRouter = require('./routers/subjectRouter');

const app = express();
const cors=require('cors')

app.use(cors());
app.use(express.json());
require('./database')

app.use('/api/students', studentsRouter)
app.use('/api/tests', testRouter)
app.use('/api/studentToTest', studentToTestRouter)
app.use('/api/subject', subjectRouter)

app.listen(8000)
