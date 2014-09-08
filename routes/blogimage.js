/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-7-15
 * Time: 上午7:56
 * To change this template use File | Settings | File Templates.
 */
exports.blogimages = function(req, res){
    if(req.method.toLowerCase()=="post"){
    }else{
        var strpid=req.query.pid;
        if(strpid!=null && strpid!=""){
            var models = require("./imgmodels");
            models.imgmodel.find({imgaddress:strpid}).exec(function(err,docs){
                if(docs!=null && docs.length>0){
                    var imgtype="";
                    var bitmap ="";
                    if(docs[0]._doc.imgtype.indexOf("/")>-1){
                        imgtype=docs[0]._doc.imgtype;
                        bitmap=docs[0]._doc.imgdata;
                    }else{
                        imgtype=docs[0]._doc.imgdata.substring(docs[0]._doc.imgdata.indexOf(":")+1,docs[0]._doc.imgdata.indexOf(";"));
                        var base64Data = docs[0]._doc.imgdata.substr(docs[0]._doc.imgdata.indexOf(",")+1);
                        bitmap=new Buffer(base64Data, 'base64');
                    }
                    res.writeHead(200, {'Content-Type':imgtype});
                    res.write(bitmap, "binary");
                    res.end();
                }
            });

        }
    }
};