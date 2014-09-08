/* GET home page. */
exports.index = function(req, res){
    if (req.session.user) {
        //1.返回格式化页面信息
        res.render('index', {username:req.session.user.username});
    } else {
        res.sendfile('./public/statichtml/logout.html');
        //res.send("<a href='/login'> Login</a>" + "<br>" + "<a href='/signup'> Sign Up</a>");
    }
};
