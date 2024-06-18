const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const MongoDB =require("../db/db")
const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    ID: {
        type: String,
        required: true,
        unique: true
    },
    timeTable:{
        type:Object,
        default:{
            timeTableId:"",
            ward:""
        }
    }
});

// Static method for login
StudentSchema.statics.login = async function (ID, password) {
    const user = await this.findOne({ ID });
    if (!user) {
        throw new Error("Incorrect ID");
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
        throw new Error("Incorrect password");
    }
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
};
const Student = MongoDB.model('students', StudentSchema);
module.exports = Student;
