/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-6-16
 * Time: 下午6:34
 * To change this template use File | Settings | File Templates.
 */
var HttpManager ={
    HttpServiceAddress:"http://localhost:3000",
    PostManager:function(_obj){
        $.post(
            _obj.url,
            { "jsonData": _obj.pars},
            function (_result) {
                _obj.CallBackFunction(_result);
            },
            "json");
    },
    GetManager:function(_obj){
        $.ajax({
            type: "POST",
            url:_obj.url,
            dataType: "jsonp",
            data:_obj.pars,
            success: function (_result) {
                _obj.CallBackFunction(_result);
            },
            error: function (_result) {
                _obj.CallBackFunction({"result":"false","data":"","message":"发生异常！"});
            }
        });
    }
};