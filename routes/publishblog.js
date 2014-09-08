/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-6-24
 * Time: 上午11:09
 * To change this template use File | Settings | File Templates.
 */
exports.publishblog = function(req, res){
    if (req.session.user) {
        if(req.method.toLowerCase()=="get"){
            //GET
            //1.返回格式化页面信息
            res.render('publishblog',{username:req.session.user.username});
        }else{
            var ReturnJSON={
                result:"false",
                "data":"",
                "message":"处理失败!"
            };
            //POST
            var querypars=req.body.jsonData;
            querypars=JSON.parse(querypars);

            var isReturn=false;
            switch(querypars.methname){
                case "insert":
                    //region 插入
                    querypars.pars.bloginfo.bcreatetime=new Date();
                    querypars.pars.bloginfo.bupdatetime=querypars.pars.bloginfo.bcreatetime;
                    querypars.pars.bloginfo.bauthuser=req.session.user.username;
                    try{
                        var models = require("./blogmodels");
                        var newblog = new models.blogmodel(querypars.pars.bloginfo);
                        newblog.save();

                        ReturnJSON.result="true";
                        ReturnJSON.data=null;
                        ReturnJSON.message="插入成功！";
                    }catch(ex){
                        ReturnJSON.message="插入失败！";
                    }
                    break;
                    //endregion
                case "uploadimg":
                    //region 图片上传
                    var strimgid=GetGUID();
                    var imgdata=querypars.pars.imginfo.imgdata;

                    var imgtype=imgdata.substring(imgdata.indexOf(":")+1,imgdata.indexOf(";"));
                    var base64Data = imgdata.substr(imgdata.indexOf(",")+1);
                    //将base64图片字符串转换为二进制图片数据，压缩大小
                    var bitmap = new Buffer(base64Data, 'base64');

                    var imgmodelinfo={
                        imgid:strimgid,
                        imgtype:imgtype,
                        imgaddress:strimgid+querypars.pars.imginfo.imgtype,
                        imgdata:bitmap,
                        imgauthuser:req.session.user.username
                    }
                    try{
                        var models = require("./imgmodels");
                        var newblog = new models.imgmodel(imgmodelinfo);
                        newblog.save();

                        ReturnJSON.result="true";
                        ReturnJSON.data={imgindex:querypars.pars.imginfo.imgindex,imgurl:imgmodelinfo.imgaddress};
                        ReturnJSON.message="上传成功！";
                    }catch(ex){
                        ReturnJSON.data={imgindex:querypars.pars.imginfo.imgindex,imgurl:null};
                    }
                    break;
                    //endregion
                case "getbloglist":
                    isReturn=true;
                    var models = require("./blogmodels");
                    //region 获取列表
                    models.blogmodel.find({}).sort({'_id':-1}).limit(querypars.pars.start,querypars.pars.size).exec(function(err,docs){
                        var ReturnJSON={
                            result:"false",
                            "data":[],
                            "message":"处理失败!"
                        };
                        if(docs!=null && docs.length>0){
                            ReturnJSON.result="true";
                            for(var i=0;i<docs.length;i++){
                                ReturnJSON.data.push(docs[i]._doc)
                            }
                            ReturnJSON.message="查询成功！";
                        }

                        ReturnJSON=JSON.stringify(ReturnJSON);
                        res.write(ReturnJSON);
                        res.end();
                    });
                    //endregion
                    break;
                default :
                    break;
            }
            if(!isReturn){
                ReturnJSON=JSON.stringify(ReturnJSON);
                res.write(ReturnJSON);
                res.end();
            }
        }
    } else {
        res.sendfile('./public/statichtml/logout.html');
    }
};
function GetGUID(){
    var thisDate=new Date();
    //region 时间统一&格式化
    var _year=thisDate.getFullYear()+"";
    var _month=thisDate.getMonth()+1;
    if(_month<10){
        _month="0"+_month;
    }
    _month=_month+"";
    var _day=thisDate.getDate();
    if(_day<10){
        _day="0"+_day;
    }
    _day=_day+"";
    var _hours=thisDate.getHours();
    if(_hours<10){
        _hours="0"+_hours;
    }
    _hours=_hours+"";
    var _minutes=thisDate.getMinutes();
    if(_minutes<10){
        _minutes="0"+_minutes;
    }
    _minutes=_minutes+"";
    var _seconds=thisDate.getSeconds();
    if(_seconds<10){
        _seconds="0"+_seconds;
    }
    _seconds=_seconds+"";
    var _milliseconds=thisDate.getMilliseconds()+"";
    //endregion
    var timestr=_year+_month+_day+_hours+_minutes+_seconds+_milliseconds;

    var strguid=timestr+(
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)+
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)+
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)).toUpperCase();
    thisDate=null;
    timestr=_year=_month=_day=_hours=_minutes=_seconds=_milliseconds=null;
    return strguid;
}