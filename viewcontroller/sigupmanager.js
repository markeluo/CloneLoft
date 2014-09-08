/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-7-12
 * Time: 下午8:08
 * To change this template use File | Settings | File Templates.
 */
$(document.body).ready(function(ev){
    $("#btnselphoto").bind("click",function(ev){
        $('#blogphoto').trigger("click");
        return false;
    });

    $('#blogphoto').change(function(ev){
        var photocontrol=this;
        var fileList = photocontrol.files;
        var tempimg="";
        var reader=null;
        if(fileList!=null && fileList.length>0){
            reader = new FileReader();
            reader.onload =function(e){
                tempimg="<img src='"+e.target.result+"' class='userphotoimgsty' style='margin-top:0px;'/>";
                $("#userphotodiv").append(tempimg);
                $("#blogphotodata").val(e.target.result);
            };
            reader.readAsDataURL(fileList[0]);
        }
    });
});