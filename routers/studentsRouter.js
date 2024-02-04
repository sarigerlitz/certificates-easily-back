const express = require("express");
const studentsBL = require("../controllers/studentsBL")
const router = express.Router();
const PDFDocument = require('pdfkit');
const nodemailer = require("nodemailer");
//TODO: change all functions to asycn/await

router.route('/:id/uncompletedTests').get(async (req, res) => {
    console.log(req.params.id)
    const tests = await studentsBL.getUncompletedStudentsTests(req.params.id)
    res.json(tests)
    // res.send("uncompleted tets!! "+ req.params.id);
});

router.route('/:id').put(async (req, res) => {
    console.log(req)
    res.send('succes')
})

router.route('/')
    .get(function (req, resp) {
        studentsBL.getAllStudent().then(data => { return resp.json(data) })
    })


router.route('/:id/testsStatus')
    .get(function (req, resp) {
        const id = req.params.id;
        studentsBL.login(id).then(data => { return resp.json(data) })
    })

router.route('/login/:id/:password')
    .get(function (req, resp) {
        const id = req.params.id;
        const password= req.params.password
        studentsBL.login(id,password).then(data => { return resp.json(data) })
    })
router.route('/payments/:id').post(async (req, res) => {
    console.log(req.body)
    const { sum, status, reference } = req.body.pay;
    const payments = await studentsBL.payments(req.params.id, sum, status, reference);
    return res.json(payments);
});

router.route('/:id')
.get(function(req,resp){
    const id=req.params.id;
    studentsBL.getStudentByID(id).then(data=>{return resp.json(data)})
})
router.route('/')
    .post(function (req, resp) {
        const obj = req.body;
        studentsBL.createStudent(obj).then(data => { return resp.json(data) })
    })
router.route('/')
    .put(function (req, resp) {
        const obj = req.body;
        studentsBL.updateStudent(obj).then(data => { return resp.json(data) })
    })
router.route('/:id')
    .delete(function (req, resp) {
        const id = req.params.id;
        studentsBL.deleteStudent(id).then(data => { return resp.json(data) })
    })
router.get('/pdf/:id/:status', async function (req, res) {
    const id = req.params.id;
    const s=req.params.status;
    const data = await studentsBL.createPDFDoc(req, res, id,s);
    return data
})
module.exports = router;