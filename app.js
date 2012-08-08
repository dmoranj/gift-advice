
/**
 * Module dependencies.
 */

var express = require('express')
  , home = require('./routes/home')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('The red dog is feeling blue'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Middleware
//--------------------------------------------------------------------------------
function requiresLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

// List of routes
//--------------------------------------------------------------------------------

app.get('/home', requiresLogin, home.show);

// User related routes
app.get('/users/login', users.showLogin);
app.post('/users/login', users.login);
app.get('/users/logout', users.logout);
app.get('/users/register', users.showRegister);
app.post('/users/register', users.register);
app.get('/users/:userId', requiresLogin, users.showUser);
app.delete('/users/:userId', users.delete);

// Advice related routes

http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});
