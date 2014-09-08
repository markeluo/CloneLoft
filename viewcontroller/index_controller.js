/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 14-6-16
 * Time: 下午6:22
 * Detail:index 页面View 处理
 * To change this template use File | Settings | File Templates.
 */
$(document.body).ready(function(ev){
    loadbloglist(0);
});
function loadbloglist(_page){
    var strparsobj={
        methname:"getbloglist",
        pars:{
            start:_page,
            size:5
        }
    };
    var strparsobj=JSON.stringify(strparsobj);
    var httpobj={
        url:HttpManager.HttpServiceAddress+"/publishblog",
        pars:strparsobj,
        CallBackFunction:function(_result){
            var strbloglist="";
            if(_result.result=="true"){
                if(_result.data!=null && _result.data.length>0){
                    var userphotoid="";
                    for(var i=0;i<_result.data.length;i++){//docs[0]._doc
                        userphotoid="userphots?user="+_result.data[i].bauthuser;
                        strbloglist+="<div class='bmlistitemsty'>";
                            strbloglist+="<div class='bmlistitemimg'><img src="+userphotoid+" style='width:100%;height;100%;'/></div>";
                            strbloglist+="<div class='bmlistitemcontent'>";
                                strbloglist+="<div class='blogtopdiv'><div class='blogtoprightdiv'></div></div>";
                                strbloglist+="<div class='blogymdiv'>";
                                    strbloglist+="<div class='blogymdiv1'>"+_result.data[i].bauthuser+"</div>";
                                    strbloglist+="<div class='blogymdiv2'>"+FormatBlogContent(_result.data[i])+"</div>";
                                strbloglist+="</div>";
                            strbloglist+="</div>";
                            strbloglist+="<div class='clearbothsty'></div>";
                        strbloglist+="</div>";

                    }
                }
            }
            $("#bloglist").append(strbloglist);
            //LoadBlogUserPhotos(_result.data,0);
        }
    };
    HttpManager.PostManager(httpobj);
}
function FormatBlogContent(_bloginfo){
    var strinfo="";
    switch (_bloginfo.btype){
        case "blog_music":
            strinfo+="<embed src="+_bloginfo.bmusic+" width='257' height='30' wmode='transparent'></embed>";
            strinfo+=_bloginfo.bcontent;
            break;
        case "blog_redio":
            strinfo+="<embed src="+_bloginfo.bvideo+" width='500' height='300' wmode='transparent'></embed></br>"
            strinfo+=_bloginfo.bcontent;
            break;
        case "blog_img":
            strinfo+=FormatContentImg(_bloginfo.bimglist)
            strinfo+="<div class='blogitemimgtxtcontent'>"+_bloginfo.bcontent+"</div>";
            break;
        case "blog_text":
            strinfo+="<div>"+_bloginfo.bcontent+"</div>";
            break;
        default :
            strinfo+="<div>"+_bloginfo.bcontent+"</div>";
            break;
    }
    return strinfo;
}
//初始化图片显示
function FormatContentImg(_ImgListInfo){
    var strimgdiv="";
    if(_ImgListInfo!=null && _ImgListInfo.length>0){
        var arrayimg=_ImgListInfo.split(";");
        strimgdiv+="<div class='contentimgdiv' onclick='expendlist(this)'>";
        strimgdiv+="<img src='blogimage?pid="+arrayimg[0]+"' class=''><span class='contentimgtol'>"+arrayimg.length+"</span>";
        strimgdiv+="<div class='blogitemimglist' data-imglist='"+_ImgListInfo+"'></div>";
        strimgdiv+="</div>";
    }
    return strimgdiv;
}
//展开图片列表
function expendlist(obj){
    var strimglist=$(obj).find("div").data("imglist");
    if(strimglist!=null){
        var arrayimglist=strimglist.split(";");
        if(arrayimglist!=null && arrayimglist.length>0){
            var strimgitem="";
            for(var i=0;i<arrayimglist.length;i++){
                if(arrayimglist[i]!=""){
                    strimgitem+="<img src='blogimage?pid="+arrayimglist[i]+"'/><a href='blogimage?pid="+arrayimglist[i]+"' target='_blank'>查看原图</a>";
                }
            }
            $(obj).css({"width":"100%","height":"100%"}).html(strimgitem);
        }
    }
}