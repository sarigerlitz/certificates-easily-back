const Student = require('../models/studentModel');
const Subject = require('../models/subjectMudel');
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');

const login = function (id,password) {
  console.log('login')
  return new Promise((resolve, reject) => {
    Student.findOne({ "id": id,"password":password }, function (err, data) {
      if (err)
        return reject(err);
      else if (data == null) { return resolve(-1); }
      else
        if (data.BalanceOfPayment > 0) { return resolve(1); }
        else {
          let d = 0;
          data.tests.map(item=>{
            if(item.mark == ''){
              d = 1;
              return;
            }
          })

          if (d == 1)
            return resolve(2);
        }

      return resolve(0);
    })
  })
}
//create a pdf file Most updated!!!
const createPDFDoc = async function (req, res, id, status) {
  const recipientTypeArr = [" ", "לכל המעונין", "עבור ביטוח  לאומי", "עבור תחבורה ציבורית"];


  try {
    const student_1 = await Student.findOne({ "id": id }, { email: true, firstName: true, lastName: true, id: true }).exec();
    if (student_1) {
      if (!status) {
        status = 0;
      }
      const recipientType = recipientTypeArr[status];
      const myDoc = new PDFDocument()
      myDoc.info = {
        Title: `אישור לימודים ${student_1.firstName}  ${student_1.lastName}`,
        Author: "מכון בית יעקב למורות ירושלים",
        Subject: `אישור לימודים לשנת תשפ"ג`,
        Keywords: "אישור לימודים",
        CreationDate: new Date(),
        ModDate: new Date(),
        Creator: "STUDENT CERTIFICATE",
        Producer: "pdfkit"
      };
      const year= new Date().getFullYear();
      const text = ` ${recipientType} אנו מאשרים כי`;
      const text2 = ` ${student_1.firstName}  ${student_1.lastName}` + ` מ.ז. ${student_1.id}`;
      const text3 = `לומדת במוסדנו "מכון בית יעקב למורות ירושלים" בשנת הלימודים ${year} `;
      myDoc.image('./images/mbjcomp.png', {
        fit: [100, 100],
        align: 'center',
        valign: 'center',
      }, 1, 50);
      myDoc.fontSize(16);

      myDoc.font('./fonts/Assistant-ExtraBold.ttf')
      myDoc.text(` אשור  לימודים `.split(" ").reverse().join(" "), {
        align: 'center',
        underline: true
      }, 100, 50)

      myDoc.fontSize(12);
      myDoc.moveDown(1.5);
      myDoc.text(` ${text2}`.split(" ").reverse().join(" ") + ` ${text}`.split(" ").reverse().join(" "), {
        // align: 'justify'
        align: 'center'

      });
      myDoc.moveDown(1.5);
      myDoc.text(` ${text3}`.split(" ").reverse().join(" "), {
        // align: 'justify'
        align: 'center'
      });
      myDoc.moveDown(10);
      myDoc.text(`  בברכה הנהלת הסמינר`.split(" ").reverse().join(" "), {
        align: 'center'
      });
      myDoc.end()
      const buffers = []
      myDoc.on("data", buffers.push.bind(buffers))
      myDoc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        sendEmail(student_1.email,
         { filename:`אישור לימודים ${student_1.firstName} ${student_1.lastName}.pdf`, content: pdfData })
        res.end(pdfData)
      });
    }
  }
  catch (err) {
    console.log(err)
    return err;
  }
}
const sendEmail = function (email, filepath) {
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
    from : process.env.EMAIL_USERNAME,
    to: email,
    subject: filepath.filename,
    attachments: filepath,
    text: 'שלום לך תלמידה יקרה נשלח  אליך כעת מסמך PDF המהווה אישור על לימודיך במוסדנו ,נא שימרי מסמך זה ,אין להעבירו בשום פנים ואופן ,תודה רבה'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
const getAllStudent = function () {
  return new Promise((resolve, reject) => {
    Student.find({}, function (err, data) {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}
const getStudentByID = async (id) => {

  return new Promise((resolve, reject) => {
    Student.findOne({ "id": id }, function (err, data) {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

const payments = async (id, sum, status, reference) => {
  const student = await Student.findOne({ "id": id });
  console.log(student.payments)
  const newvalues = await {
    $set: { BalanceOfPayment: student.BalanceOfPayment - sum },
    $push: { payments: { "sum": sum, "status": status, "reference": reference } }
  };
  try {
    const result = await Student.findOneAndUpdate({ 'id': id },
      newvalues,
      { new: true }
    );
    return result;
  } catch (err) {
    return err
  }
};

const createStudent = function (obj) {
  return new Promise((resolve, reject) => {
    const student = new Student(obj)
    student.save(function (err) {
      if (err) {
        reject(err)
      }
      else {
        resolve("Created !")
      }
    })

  })
}

const updateStudent = function (obj) {
  return new Promise((resolve, reject) => {
    Student.updateOne({_id:obj._id}, obj,
      function (err) {
        if (err) {
          reject(err)
        }
        else {
          resolve("Updated !")
        }
      })

  })
}
const deleteStudent = function (id) {
  return new Promise((resolve, reject) => {
    Student.findByIdAndDelete(id, function (err, data) {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

const getUncompletedStudentsTests = async (id) => {
  try {
    const student_1 = await Student.findOne({ "id": id }).exec();
    if (student_1) {
      // const uncompleteTets = Object.keys(student_1.tests).filter((key) => {
      //   if (student_1.tests[key].length < 1)
      //     return key;
      // })
      const s = await Subject.find()
      const tests =  student_1.tests.filter(x=>x.mark == '').map(x => x.subjectId)
      const uncompleteTets = s.filter(x=>tests.includes(x._id))
      return uncompleteTets;
    }
  }
  catch (err) {
    console.log(err)
    return err;
  }
};



module.exports = {
  getAllStudent,
  createStudent,
  getStudentByID,
  updateStudent,
  deleteStudent,
  createPDFDoc,
  login,
  payments,
  getUncompletedStudentsTests
}
