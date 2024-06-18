const MongoDB =require("../db/db");
const mongoose =require("mongoose")
const Schema = mongoose.Schema;
const WardSchema = new Schema({
    name: { type: String, required: true }
  });
const Wards = MongoDB.model('wards', WardSchema);
module.exports = Wards;
