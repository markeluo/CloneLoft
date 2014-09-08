var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');
var servicemanager=require('./routes/webservice');
var blogimagesmanager=require('./routes/blogimage');
var publishblog=require('./routes/publishblog');
var  mongoose = require('mongoose');
var hash = require('./viewcontroller/pass').hash;

var app = express();

//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

/*
 Database and Models
 */
mongoose.connect("mongodb://localhost:27017/TEST");
var User = require("./routes/usermodels").User;
/*
 Middlewares and configurations
 */
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser('Authentication Tutorial '));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

/*
 Helper Functions
 */
function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
            username: name
        },

        function (err, user) {
            if (user) {
                if (err) return fn(new Error('cannot find user'));
                hash(pass, user.salt, function (err, hash) {
                    if (err) return fn(err);
                    if (hash == user.hash) return fn(null, user);
                    fn(new Error('invalid password'));
                });
            } else {
                return fn(new Error('cannot find user'));
            }
        });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'viewcontroller')));
app.use(app.router);

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/', routes.index);
app.get('/userphots', users.list);
app.get('/blogimage', blogimagesmanager.blogimages);
app.post('/webservice', servicemanager.webservice);
app.get('/webservice', servicemanager.webservice);
app.get('/publishblog', publishblog.publishblog);
app.post('/publishblog', publishblog.publishblog);

//region 登录相关处理
app.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signup");
    }
});
app.post("/signup", userExist, function (req, res) {
    console.log(JSON.stringify(req.body))
    var password = req.body.password;
    var username = req.body.username;
    var ublogname=req.body.ublogname;
    var logphoto=req.body.logphotodata;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            salt: salt,
            hash: hash,
            ublogname:ublogname,
            logphoto:logphoto,
            logbrief:"",
            reatedate:new Date()
        }).save(function (err, newUser) {
                if (err) throw err;
                authenticate(newUser.username, password, function(err, user){
                    if(user){
                        req.session.regenerate(function(){
                            req.session.user = user;
                            req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                            res.redirect('/');
                        });
                    }
                });
            });
    });
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = '登录失败，请您检查用户名或密码是否正确!';
            res.redirect('/login');
        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get('/profile', requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});
//endregion

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(3000);

module.exports = app;
