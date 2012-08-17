
/**
 * Module dependencies.
 */

var express = require('express')
  , home = require('./routes/home')
  , users = require('./routes/users')
  , requests = require('./routes/requests')
  , advices = require('./routes/advices')
  , notifications = require('./routes/notifications')
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

});

app.configure('development', function(){
    app.use(express.errorHandler());
    app.use(express.session({ secret: 'your secret here' }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('testing', function(){
    app.use(express.errorHandler());
    app.use(express.session({ secret: 'your secret here' }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('production', function(){
    var RedisStore = require('connect-redis')(express);
    var sessionStore = new RedisStore();

    app.use(express.errorHandler());
    app.use(express.session({ store: sessionStore , secret: "Bring me the golden peanuts, you fool!", key: 'express.sid'}));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
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
app.get('/users', requiresLogin, users.list);

// Request related routes
app.get('/users/:requester/requests/:requestId', requiresLogin, requests.show);
app.get('/users/:requester/requests', requiresLogin, requests.list);
app.post('/users/:requester/requests', requiresLogin, requests.create);
app.delete('/users/:requester/requests/:requestId', requiresLogin, requests.delete);

// Advice related routes
app.post('/users/:requester/requests/:requestId/advices', requiresLogin, advices.create);
app.get('/users/:requester/advices', requiresLogin, advices.listByUser);
app.get('/users/:requester/requests/:requestId/advices', requiresLogin, advices.list);
app.delete('/users/:requester/requests/:requestId/advices/:adviceId', requiresLogin, advices.delete);
app.get('/users/:requester/requests/:requestId/advices/:adviceId', requiresLogin, advices.show);

// Notification related routes
app.post('/users/:requester/notifications', requiresLogin, notifications.create);
app.get('/users/:requester/notifications', requiresLogin, notifications.list);
app.get('/users/:requester/notifications/:notificationId', requiresLogin, notifications.show)
app.delete('/users/:requester/notifications/:notificationId', requiresLogin, notifications.delete);


http.createServer(app).listen(app.get('port'), function(){

});

require("./model/dbUtils").cleanDb(function() {
   console.log("Ejecutando callback");
});