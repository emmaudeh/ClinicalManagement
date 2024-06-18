const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const MongoDB =require("../db/db")
const hospitalAdmin = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    }
})

hospitalAdmin.statics.login = async function (ID, password) {
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

const HospitalAdmin = MongoDB.model('HospitalAdmins', hospitalAdmin);
module.exports = HospitalAdmin;