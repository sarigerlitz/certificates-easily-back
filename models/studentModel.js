const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    id: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    BalanceOfPayment: String,
    schoolYear: String,
    tests: {
        type: [{
            subjectId: { type: mongoose.SchemaTypes.ObjectId, ref: "subject" },
            mark: String,
        }]
    }
} )
module.exports = mongoose.model('student', StudentSchema);