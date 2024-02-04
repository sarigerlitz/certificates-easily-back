const mongoose = require('mongoose')


const studentToTestSchema = mongoose.Schema({
  studentId: { type:mongoose.SchemaTypes.ObjectId, ref: "student" },
  testId: {type:mongoose.SchemaTypes.ObjectId, ref: "test"},
  answers:{type:[{answer:String}]}
})


module.exports = mongoose.model( 'studentToTest' , studentToTestSchema)