const Test = require('../models/testModel')
const Subject = require('../models/subjectMudel')
const mongoose = require("mongoose");


const createTest = async (req,res) =>{
    console.log("createTest!!!");
    const test = new Test(req.body);
    try {
      const newTest = await test.save();
      res.status(200).send(newTest)
    } catch (error) {
      res.status(500).send(error.message);
    }
}

const getTestBySubject = (req, res) => {
    console.log("getTestBySubject!!!");
      Test.findOne({subjectId:req.params.subjectId})
      .then((test) => {
        if(test)
        res.status(200).send(test)
        else
        res.status(404).send("test not exists")
      }).catch((error) => {res.status(400).send(error.message);})
};

const getTestById = (req, res) => {
  console.log("getTestById!!!");
    Test.findById(req.params.id)
    .then((test) => {
      if(test){
         Subject.findById(test.subjectId)
          .then(s=>res.status(200).json({test:test,subject:s.subject}))
      }
      else
      res.status(404).send("test not exists")
    }).catch((error) => {res.status(400).send(error.message);})
};


const updateTest = async(req, res) => {
    console.log("updateTest!!!!")
    Test.findByIdAndUpdate(req.body._id,req.body ,{new:true})
    .then(t=>{
        res.status(200).send(t)
    }).catch(err=>
        res.status(500).send(err.message))
   };
   
   const deleteTest = async(req, res) => {
       console.log("deleteTest!!!")
       Test.findByIdAndDelete(req.params.id)
       .then(t=>res.status(200).send(t))
       .catch(err=>res.status(400).send(err.message))
   };

module.exports = {createTest,getTestBySubject,updateTest,deleteTest,getTestById}