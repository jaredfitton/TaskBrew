"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.redirect("/");
        return;
    }
    response.clearCookie("authData").redirect("/");
}
exports.resolve = resolve;
