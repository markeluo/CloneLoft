/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-6-16
 * Time: 上午11:10
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Define User schema
var _Studentlist = new Schema({
    uid : String,
    uname : String,
    ugroupname:String,
    udayvalue:Number,
    umonthvalue:Number,
    uyearvalue:Number
});
// export them
exports.StudentList = mongoose.model("students",_Studentlist);