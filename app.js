/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')({ session: session });
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */

var applicationController = require('./controllers/application');
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var courseController = require('./controllers/course');
var clientController = require('./controllers/client');
var projectController = require('./controllers/project');
var logtimeController = require('./controllers/logtime');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var adminController = require('./controllers/admin');
var accessController = require('./controllers/access-control');
/**
 * API keys and Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/url1', '/url2'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
  helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  // CSRF protection.
  if (_.contains(csrfExclude, req.path)) return next();
  csrf(req, res, next);
});
app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Remember original destination before login.
  var path = req.path.split('/')[1];
  if (/auth|login|logout|signup|fonts|favicon/i.test(path)) {
    return next();
  }
  req.session.returnTo = req.path;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

/**
 * Main routes.
 */

app.get('/', applicationController.index);

/**
 * Access Control
 */
app.get('/403', accessController.index);
/**
* Admin Routes
*/
//app.get('/admin', adminController.index);


app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

/**
* Home routes
*/
app.get('/home', passportConf.isAuthenticated, homeController.index);
/**
* Users routes
*/
app.get('/users', passportConf.isAuthenticated, passportConf.isAdmin, userController.index);
app.post('/new_user', passportConf.isAuthenticated, passportConf.isAdmin, userController.createUser);
app.get('/getUsersList', passportConf.isAuthenticated, passportConf.isAdmin, userController.getUsersList);
app.post('/updateUser', passportConf.isAuthenticated, passportConf.isAdmin, userController.updateUser);
app.post('/deleteUser', passportConf.isAuthenticated, passportConf.isAdmin, userController.deleteUser);

/**
* Courses routes
*/
app.get('/courses', passportConf.isAuthenticated, courseController.index);
app.post('/new_course', passportConf.isAuthenticated, courseController.createCourse);
app.get('/getCourseList', passportConf.isAuthenticated, courseController.getCourseList);
app.post('/updateCourse', passportConf.isAuthenticated, courseController.updateCourse);
app.post('/deleteCourse', passportConf.isAuthenticated, courseController.deleteCourse);

/**
* Client routes
*/
app.get('/clients', passportConf.isAuthenticated, passportConf.isAdmin, clientController.index);
app.post('/client/new', passportConf.isAuthenticated, passportConf.isAdmin, clientController.newClient);
app.get('/client/getAllData', passportConf.isAuthenticated, passportConf.isAdmin, clientController.getAllData);
app.post('/client/edit', passportConf.isAuthenticated, passportConf.isAdmin, clientController.edit);
app.post('/client/delete', passportConf.isAuthenticated, passportConf.isAdmin, clientController.del);

/**
* Projects routes
*/
app.get('/projects', passportConf.isAuthenticated, passportConf.isAdmin, projectController.index);
app.post('/project/new', passportConf.isAuthenticated, passportConf.isAdmin, projectController.newProject);
app.get('/project/getAllData', passportConf.isAuthenticated, passportConf.isAdmin, projectController.getAllData);
app.post('/project/edit', passportConf.isAuthenticated, passportConf.isAdmin, projectController.edit);
app.post('/project/delete', passportConf.isAuthenticated, passportConf.isAdmin, projectController.del);

/**
* Log Entry routes
*/
app.get('/logtime', passportConf.isAuthenticated, logtimeController.index);
app.post('/logtime/new', passportConf.isAuthenticated, logtimeController.newLogEntry);
app.get('/logtime/getAllData', passportConf.isAuthenticated, logtimeController.getAllData);
app.post('/logtime/edit', passportConf.isAuthenticated, logtimeController.edit);
app.post('/logtime/delete', passportConf.isAuthenticated, logtimeController.del);

/**
 * API examples routes.
 */

app.get('/api', apiController.getApi);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
/**
 * OAuth sign-in routes.
 */



/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;