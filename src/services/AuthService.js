"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var user_1 = require("../schema/user");
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.parse = function (raw) {
        var no = {
            signedIn: false
        };
        if (raw.hasOwnProperty("signedIn")) {
            var signedIn = raw.signedIn;
            if (signedIn) {
                if (raw.hasOwnProperty("user")) {
                    var userData = raw.user;
                    var userObj = user_1.User.parse(userData);
                    if (userObj) {
                        return {
                            signedIn: true,
                            user: userObj
                        };
                    }
                }
            }
        }
        return no;
    };
    AuthService.extract = function (req) {
        if (req.signedCookies && req.signedCookies.authData) {
            return AuthService.parse(req.signedCookies.authData);
        }
        return {
            signedIn: false
        };
    };
    AuthService.validate = function (auth) {
        return auth.signedIn;
    };
    return AuthService;
}());
exports.AuthService = AuthService;
