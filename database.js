//const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/cars',{ useUnifiedTopology: true,useNewUrlParser: true })


const express = require('express');
const mongoose = require('mongoose');

//exports.handler = (event, context, callback) => {
mongoose.connect(
'mongodb://localhost:27017/school',
  // 'mongodb://127.0.0.1:27017/school',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
  }
),
  () => {
    try {
      //something
    } catch (error) {
      console.error(error);
    }
  };
const connection = mongoose.connection;
mongoose.set('debug', false);

connection.once('open', () => {
  console.log('😊 Connection to DB was succesful');
});

