/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-7-2
 * Time: 下午3:03
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Define User schema
var _imgmodelschema = new Schema({
    imgid:{type:String,default:""},
    imgtype:{type:String,default:""},
    imgaddress:{type:String,default:""},
    imgdata:{type:String,default:""},
    imgauthuser:{type:String,default:""}
});
// export them
exports.imgmodel = mongoose.model("imgtabs",_imgmodelschema);
