const StudentToTest = require('../models/studentToTest')
const student = require('../models/studentModel')
const Test = require('../models/testModel')
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const createStudentToTest = async (req, res) => {
  console.log("createStudentToTest!!!");
  const s = new StudentToTest(req.body);
  try {
    const news = await s.save()
    let t = await Test.findById(news.testId)
    let mark = 0
    t.answers.map((item, key) => {
      if (t.type) {
        let count = 0
        let flag = false;
        item.answer.split(';').map(i => {
          flag = false
          i.split(',').map(value => {
            if (news.answers[key].answer.includes(value.trim()))
              flag = true;
          });
          if (flag)
            count++;
        })
        if (count > (item.answer.split(';').length / 2))
          mark += (100 / t.questions.length)
      } else {
        if (news.answers[key].answer == item.answer.split('\n')[0])
          mark += (100 / t.questions.length) + (100 % t.questions.length)
      }
    })
    if (mark > 100) {
      mark = 100;
    }
    if (mark >= 60) {
      res.status(200).send({ mark: Math.round(mark), id: news._id })
    }
    else {
      //לשלוח למורה קישור
      sendEmail(t.teacherEmail, 'http://localhost:3000/CheckTest/' + news._id)
      sendEmail(process.env.EMAIL_USERNAME, 'http://localhost:3000/CheckTest/' + news._id)
      res.status(200).send({ mark: '' })
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getTestBySubjectAndStudentId = async (req, res) => {
  console.log("getTestBySubjectAndStudentId!!!");
  try {
    let test = await Test.findOne({ subjectId: req.body.subjectId })
    let s = await student.findOne({ id: req.body.studentId })
    if (!test || !s)
      res.status(200).send('no test')
    else {
      StudentToTest.findOne({ testId: test._id, studentId: s._id })
        .then(x => {
          res.status(200).send(x)
        }).catch((error) => res.status(400).send(error.message))
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const getStudentToTestById = (req, res) => {
  console.log("getStudentToTestById!!!");
  StudentToTest.findById(req.params.id)
    .then((test) => {
      if (test) {
        student.findById(test.studentId)
          .then(s => {
            res.status(200).json({ test: test, name: s.firstName + " " + s.lastName })
          })
      }
      else
        res.status(404).send("test not exists")
    }).catch((error) => { res.status(400).send(error.message); })
};

const updateMark = async (req, res) => {
  console.log("updateMark!!!");
  try {
    let s = await student.findById(req.body.studentId)
    let index = s.tests.indexOf(s.tests.find(x => x.subjectId == req.body.subjectId))
    if (index !== -1)
      s.tests[index].mark = req.body.mark
    //   s.tests= s.tests.filter(x=>x.subjectId==req.body.subjectId).concat({subjectId:req.body.subjectId,mark:req.body.mark})
    student.updateOne({ _id: req.body.studentId }, s, { new: true })
      .then((st) => {
        if (req.body.isTeacher == true) {
          StudentToTest.findByIdAndDelete(req.body.id)
            .then(() => {
              console.log('delete')
              res.status(200).send(s)
            }).catch(err => console.log(err))
        }
        else
          res.status(200).send(st)
      })
      .catch(err => console.log(err))
  }
  catch (err) {
    res.status(400).send(err.message)
  }


}

const sendEmail = function (email, text) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'מורה יקרה מצורף מבחן לבדיקה , תודה רבה',
    text: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { createStudentToTest, getStudentToTestById, updateMark, getTestBySubjectAndStudentId }