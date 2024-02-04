const Subject = require('../models/subjectMudel')
const mongoose = require("mongoose");

const createSubject = async (req,res) =>{
    console.log("createSubject!!!");
    const subject = new Subject(req.body);
    try {
      const newSubject = await subject.save();
      res.status(200).send(newSubject)
    } catch (error) {
      res.status(500).send(error.message);
    }
}

const getAllSubject = (req, res) => {
    console.log("getAllSubject!!!")
    Subject.find()
    .then(s=>res.status(200).send(s))
    .catch(err=>res.status(400).send(err.message))
}

module.exports ={getAllSubject,createSubject}