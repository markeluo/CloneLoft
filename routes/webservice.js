/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-5-21
 * Time: 下午10:36
 * To change this template use File | Settings | File Templates.
 */
exports.webservice = function(req, res){
    //1.获取参数字符串
var querypars=req.body.jsonData;
    var ReturnJSON={
        result:"false",
        "data":"",
        "message":"处理失败!"
    };
    querypars=JSON.parse(querypars);
    if(querypars.methname=="search"){
        var  mongoose = require('mongoose');
        //mongoose.connect("mongodb://localhost:27017/TEST");//本机
        mongoose.connect("mongodb://jF7ncUpB:LKcQpybCiNzl@10.0.31.21:27017/markeluo_mongo_vhl0oufr");//远程服务器
        var models = require("./models");
        if(querypars.pars!=null){
            var query =querypars.pars.query;//{uid:'122'}
            models.StudentList.find(query,function(err, doc) {
                mongoose.disconnect(function(err){});
                if (err){
                }else{
                    ReturnJSON.result="true";
                    ReturnJSON.data=JSON.stringify(doc);
                    ReturnJSON.message="查询成功！";
                }
                ReturnJSON=JSON.stringify(ReturnJSON);
                res.write(ReturnJSON);
                res.end();
            });
        }else{
            models.StudentList.find(function(err, doc) {
                mongoose.disconnect(function(err){});
                if (err){
                }else{
                    ReturnJSON.result="true";
                    ReturnJSON.data=JSON.stringify(doc);
                    ReturnJSON.message="查询成功！";
                }
                ReturnJSON=JSON.stringify(ReturnJSON);
                res.write(ReturnJSON);
                res.end();
            });
        }
    }else if(querypars.methname=="insert"){
        var  mongoose = require('mongoose');
        //mongoose.connect("mongodb://localhost:27017/TEST");//本机
        mongoose.connect("mongodb://jF7ncUpB:LKcQpybCiNzl@10.0.31.21:27017/markeluo_mongo_vhl0oufr");//远程服务器
        var models = require("./models");
        var addstudents = new models.StudentList(querypars.pars.insertitem);
        addstudents.save();
        mongoose.disconnect(function(err){});

        ReturnJSON.result="true";
        ReturnJSON.data=null;
        ReturnJSON.message="插入成功！";

        ReturnJSON=JSON.stringify(ReturnJSON);
        res.write(ReturnJSON);
        res.end();
    }else if(querypars.methname=="update"){
        var models = require("./models");

        var query =querypars.pars.query;//{uid:'122'}
        var update=querypars.pars.update;// {name:'jason borne'}
        var options={ multi: true};//{name:'jason borne'}

        models.StudentList.update(query,update, options,function(err, numberAffected, raw) {
            if (err){
            }else{
                ReturnJSON.result="true";
                ReturnJSON.data=raw;
                ReturnJSON.message="更新成功！";
            }
            ReturnJSON=JSON.stringify(ReturnJSON);
            res.write(ReturnJSON);
            res.end();
        });
    }else if(querypars.methname=="delete"){
        var models = require("./models");

        var query =querypars.pars.query;//{uid:'122'}

        var models = require("./models");
        models.StudentList.remove(query, function(err, docs) {
            if (err){
            }else{
                ReturnJSON.result="true";
                ReturnJSON.data=docs;
                ReturnJSON.message="删除成功！";
            }
            ReturnJSON=JSON.stringify(ReturnJSON);
            res.write(ReturnJSON);
            res.end();
        });
    }

};
