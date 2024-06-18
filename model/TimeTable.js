const MongoDB =require("../db/db");
const mongoose =require("mongoose")
const timetable = new mongoose.Schema({
    content:[Object]
})
const Timetable = MongoDB.model('timetables', timetable);
module.exports = Timetable;
