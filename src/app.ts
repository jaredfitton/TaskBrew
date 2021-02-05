import {credential} from "firebase-admin/lib/credential";

let createError = require('http-errors');
let express = require('express');
let path = require('path');
// let nunjucks = require('nunjucks');
import nunjucks from 'nunjucks';
let envLoader = require('dotenv');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
import {Request, Response, NextFunction, Express} from 'express';
import {APIService} from "./services/APIService";
let firebase = require('firebase-admin');

let IN_PRODUCTION = process.env.NODE_ENV === 'production';

// Load environment
envLoader.config({path: path.join(__dirname, '../config/secret.env')})
if (IN_PRODUCTION) {
    envLoader.config({path: path.join(__dirname, '../config/prod_cfg.env')})
} else {
    envLoader.config({path: path.join(__dirname, '../config/debug_cfg.env')})
}

let primaryRouter = require("./routes/primary");
let handlerRouter = require("./routes/handlers")
let providerRouter = require("./routes/providers")

let app : Express = express();

let firebaseApp = firebase.initializeApp({
    credential: firebase.credential.applicationDefault(),
    databaseURL: 'https://taskbrew-default-rtdb.firebaseio.com/'
});
let api;
if (process.env.API_PORT) {
    api = new APIService(firebaseApp.database(), firebaseApp.auth());
} else {
    api = new APIService(firebaseApp.database(), firebaseApp.auth());
}

// var nunjuckEnv = new nunjucks.Environment();
// nunjuckEnv.addFilter('extract', function(array: string[]) {
//     var output = '';
//     array.forEach(element => {
//         output += element + ' ';
//     });
//     return output;
// });

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'njk');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.static(path.join(__dirname, '../public')));

if (IN_PRODUCTION) {
    // Redirect all unsecured requests to https
    console.log("[app] Activating Gate Keeper");
    app.use (function (req, res, next) {
        if (req.get('x-forwarded-proto') === 'https') {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            console.log("[Gate Keeper] Received insecure request");
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
}

app.use('/', primaryRouter(api));
app.use('/handlers', handlerRouter(api));
app.use('/providers', providerRouter(api));


// catch 404 and forward to error handler
app.use(function(req : Request, res : Response, next : NextFunction) {
    console.log(`[main] Received 404 error when accessing route ${req.path}`);
    // next(createError(404));
    res.status(404);
    res.end()
});

// // error handler
// app.use(function(err : any, req : Request, res : Response) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;

let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`[main] App listening on port ${port}`);
})
