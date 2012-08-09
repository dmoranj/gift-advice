
/**
 * Module dependencies.
 */

var express = require('express')
  , home = require('./routes/home')
  , users = require('./routes/users')
  , requests = require('./routes/requests')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

var logFile = fs.createWriteStream('./express.log', {flags: 'a'});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger({stream: logFile}));
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
app.delete('/users/:userId', requiresLogin, users.delete);
app.get('/users', requiresLogin, users.listUsers);

// Request related routes
app.get('/requests/:requestId', requiresLogin, requests.show);
app.post('/requests', requests.create);



// Advice related routes

http.createServer(app).listen(app.get('port'), function(){

});
