$(function(){
    var BlogType="blog_text";
    // 博客类型切换
    $("#blogtypetab").tabcontrol().bind("tabcontrolchange", function(event, frame){
        BlogType = $(frame).attr("id");
    })
    $("#cancel").bind("click",function(ev){
        $("#blogtitle").val("");
        $("#blogdetail").val("");
        $("#blogtag").val("");
        return false;
    });
    $("#preview").bind("click",function(ev){

        return false;
    });
    $("#publish").bind("click",function(ev){
        var bloginfo={
            btype:BlogType,
            btitle:$("#blogtitle").val(),
            bcontent:$("#blogdetail").val(),
            btags:gettags(),
            bquoteauthuser:$("#blogpublicauth").val(),
            bmusic:"",
            bvideo:""
        }
        switch(BlogType){
            case "blog_text":
                bloginfo.bcontent=$("#blogdetail").val();
                break;
            case "blog_img":
                bloginfo.bcontent=$("#blogimgdetail").val();
                break;
            case "blog_music":
                bloginfo.bcontent=$("#blogmusicdetail").val();
                bloginfo.bmusic=$("#blogmusicaddress").data("address");
                break;
            case "blog_redio":
                bloginfo.bcontent=$("#blogrediodetail").val();
                bloginfo.bvideo=$("#blogredioaddress").val();
                break;
            default :
                break;
        }
        if(BlogType=="blog_img"){
            blogimguploadmanger(function(_imglist){
                if(_imglist!=null && _imglist.length>0){
                    bloginfo.bimglist="";
                    for(var i=0;i<_imglist.length;i++){
                        if(_imglist[i].state){
                            bloginfo.bimglist=bloginfo.bimglist+_imglist[i].imgurl+";"
                        }
                    }
                    publishblog(bloginfo);
                }else{
                    alert("图片上传失败，请重试！");
                }
            });
        }else{
            publishblog(bloginfo);
        }
        return false;
    });
    $("#blogaddimg").bind("click",function(ev){
        $('#blogimgsel').trigger("click");
        return false;
    });
    $('#blogimgsel').change(function(ev){
        var fileList = this.files;
        var tempimg="";
        var reader=null;
        for( var i = 0 ; i < fileList.length ; i++ ){
            reader = new FileReader();
            reader.onload =function(e){
                tempimg="<img src='"+e.target.result+"' class='blognewimgsty' style='margin-top:0px;'/>";
                $("#blogimglist").append(tempimg);
            };
            reader.readAsDataURL(fileList[i]);
        }
    });
    $("#btnsarch").bind("click",function(ev){
        //musicsearchlist:搜索结果显示容器
        var strsearchtitle=$("#blogmusicaddress").val();
        var listpage=$("#musicsearchlist").data("page");
        //region 新浪API
        $.ajax({
            url: "http://songs.sinaapp.com/search/key/"+strsearchtitle+"/page/"+listpage,
            type: "get",
            dataType: "jsonp",
            success: function(data, status) {
                $("#musicsearchlist").show();
                $.each(data.results, function(i,item){
                    $('#musicsearchlist ul').append("<li id="+item.song_id+" data-id="+item.song_id+">"+urldecode(item.song_name)+" - "+urldecode(item.artist_name)+"</li>");
                });
            },
            error: function() {
                $("#musicsearchlist").hide();
                $('#musicsearchlist ul').html();
            }
        });
        //endregion

        return false;
    });
    function urldecode(data) {
        return decodeURIComponent(data);
    }
    $('#musicsearchlist ul li').live("click",function(ev){
        var straddress="http://www.xiami.com/widget/0_"+this.id+"/singlePlayer.swf";
        $("#blogmusicaddress").data("address",straddress);
        $("#blogmusicaddress").val($(this).html());
        $("#musicsearchlist").hide();
    })
    /*标签Tag输入处理*/
    $("#blogtagcontentPanel").bind("click",function(ev){
        $("#blogtag").focus();
    });
    //判断标签输入是否更改、回车、删除
    $("#blogtag").keydown(function(e){
        if(e.which==13){
            TagLabelAdd($("#blogtag").val());
            return false;
        }else if(e.which==8){
            if($("#blogtag").val()==""){
                $('#blogtagcontentPanel>span:last').remove();
                return false;
            }
        }
    }).change(function(e){
        var thistempstr=this.value;
        if(thistempstr.length>1){
            if(thistempstr.lastIndexOf(",")==thistempstr.length-1){
                TagLabelAdd(thistempstr);
            }
        }
    });
    //移除标签
    $(".blogtagtxtlabel").live("click",function(ev){
       $(this).remove();
    });
    //添加标签
    function TagLabelAdd(_newTagStr){
        if(_newTagStr!=""){
            _newTagStr=_newTagStr.replace(/(^\s+)|(\s+$)/g, "");
            _newTagStr=_newTagStr.replace(",","");
            $("#blogtag").parent().before("<span class='blogtagtxtlabel'>"+_newTagStr+"</span>");
            $("#blogtag").val("").attr("placeholder","");
        }
    }
    function gettags(){
        var strtags="";
        $(".blogtagtxtlabel").each(function(i,item){
            if(strtags!=""){
                strtags+=","+item.innerText;
            }else{
                strtags=item.innerText;
            }
        })
        return strtags;
    }

    //图片资源上传管理
    function blogimguploadmanger(_callfun){
        var imglistarray=$("#blogimglist").find("img");
        imgupload(imglistarray,0,[],_callfun);
    }
    function imgupload(_imglist,_index,uploadsuccedlist,_callfun){
        var strparsobj={
            methname:"uploadimg",
            pars:{
                imginfo:{
                    user:"",
                    imgindex:_index,
                    imgtype:"."+_imglist[_index].src.substring(11,_imglist[_index].src.indexOf(";")),
                    imgdata:_imglist[_index].src
                }
            }
        };
        var strparsobj=JSON.stringify(strparsobj);
        var httpobj={
            url:HttpManager.HttpServiceAddress+"/publishblog",
            pars:strparsobj,
            CallBackFunction:function(_result){
                if(_result.result=="true"){
                    uploadsuccedlist.push({index:_result.data.imgindex,state:true,imgurl:_result.data.imgurl});
                }else{
                    uploadsuccedlist.push({index:_result.data.imgindex,state:false,imgurl:null})
                }
                if((_index+1)>=_imglist.length){
                    _callfun(uploadsuccedlist);
                }else{
                    imgupload(_imglist,_index+1,uploadsuccedlist,_callfun);
                }
            }
        };
        HttpManager.PostManager(httpobj);
    }
    //博客发布
    function publishblog(_bloginfo){
        var strparsobj={
            methname:"insert",
            pars:{
                bloginfo:_bloginfo
            }
        };
        var strparsobj=JSON.stringify(strparsobj);
        var httpobj={
            url:HttpManager.HttpServiceAddress+"/publishblog",
            pars:strparsobj,
            CallBackFunction:function(_result){
                if(_result.result=="true"){
                    alert("发布成功！");
                }else{
                    alert("发布失败！");
                }
            }
        };
        HttpManager.PostManager(httpobj);
    }
})