/* GET users listing. */
exports.list = function(req, res){
    if(req.method.toLowerCase()=="post"){
    }else{
        var username=req.query.user;
        if(username!=null && username!=""){
            var models = require("./usermodels");
            models.User.find({username:username}).exec(function(err,docs){
                if(docs!=null && docs.length>0){
                    var imgtype=docs[0]._doc.logphoto.substring(docs[0]._doc.logphoto.indexOf(":")+1,docs[0]._doc.logphoto.indexOf(";"));
                    var base64Data = docs[0]._doc.logphoto.substr(docs[0]._doc.logphoto.indexOf(",")+1);
                    var bitmap = new Buffer(base64Data, 'base64');

                    res.writeHead(200, {'Content-Type':imgtype});
                    res.write(bitmap, "binary");
                    res.end();
                }
            });

        }
    }
};


