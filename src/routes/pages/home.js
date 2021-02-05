"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
function resolve(request, response, api) {
    var _a;
    console.log("[/] Home page requested");
    var authData = AuthService_1.AuthService.extract(request);
    console.log("[/] Request cookies: " + JSON.stringify(request.signedCookies));
    if (authData.signedIn) {
        response.redirect('/board');
        return;
    }
    var pageVars = {
        page: {
            title: "Welcome",
            key: "splash"
        },
        user: {
            loggedIn: authData.signedIn,
            avatar: (_a = authData.user) === null || _a === void 0 ? void 0 : _a.avatarKey
        }
    };
    // let user = new User("jterxkcyvubiou", "jatnerd@gmail.com", "Jake", "latte", "0001")
    // user.id = "0001"
    // let cookie = {signedIn: true, user: user}
    // let cookieOptions = {secure: process.env.NODE_ENV==='production', signed: true}
    //
    // response
    //     .cookie('authData', cookie, cookieOptions)
    //     .render('splash', pageVars);
    response.render('home', pageVars);
}
exports.resolve = resolve;
