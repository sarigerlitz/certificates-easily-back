const mongoose = require('mongoose')


const testSchema = mongoose.Schema({
  teacherName: { type: String },
  teacherEmail: { type: String },
  teacherPhone: { type: String },
  subjectId: { type:mongoose.SchemaTypes.ObjectId, ref: "subject" },
  type:Boolean,
  questions: {type:[{question:String}]},
  answers: {type:[{answer:String}]}
})


module.exports = mongoose.model( 'test' , testSchema)