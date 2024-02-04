

const mongoose = require('mongoose');

mongoose.connect(
'mongodb+srv://saroosh3751:sari1234@cluster0.u54qvub.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
  },
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

