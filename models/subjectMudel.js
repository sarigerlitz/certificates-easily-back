const mongoose = require('mongoose')


const subjectSchema = mongoose.Schema({
  subject:String,
})


module.exports = mongoose.model( 'subject' , subjectSchema)