/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-7-12
 * Time: 下午9:42
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    ublogname:String,
    logphoto:String,
    logbrief:String,
    reatedate:String,
    salt: String,
    hash: String
});
exports.User = mongoose.model("users",UserSchema);