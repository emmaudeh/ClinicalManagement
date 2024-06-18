const MongoDB =require("../db/db");
const mongoose =require("mongoose");
const attendance = new mongoose.Schema({
    StartingTime:{
        type:String,
        require:true
    },
    EndingTime:{
        type:String,
        require:true
    },
    Day:{
        type:Date,
        require:true
    },
    level:{
        type:Number,
        require:true
    },
    ward:{
        type:String,
        require:true
    },
    Students:[Object]
})
const Attendance = MongoDB.model('Attendances', attendance);
module.exports = Attendance;
