/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-7-2
 * Time: 下午1:00
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Define User schema
var _modelschema = new Schema({
    btype:{type:String,default:""},
    btitle:{type:String,default:""},
    bimglist:{type:String,default:""},
    bmusic:{type:String,default:""},
    bvideo:{type:String,default:""},
    bcontent:{type:String,default:""},
    breleaseenum:{type:Number,default:0},
    bauthenum:{type:Number,default:0},
    btags:{type:String,default:""},
    bsyncenum:{type:Number,default:0},
    bcreatetime:{type:Date,default:Date.now },
    bupdatetime:{type:Date,default:Date.now },
    bquoteauthuser:{type:String,default:""},
    bauthuser:{type:String,default:""}
});
// export them
exports.blogmodel = mongoose.model("blogtabs",_modelschema);