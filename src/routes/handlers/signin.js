"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolve(request, response, api) {
    var data = request.body;
    if (!data) {
        response.status(400).send("UNAUTHORIZED").end();
        return;
    }
    api.getOrCreateAuthUser(data.token, function (usr) {
        var copts = { secure: process.env.NODE_ENV === 'production', signed: true };
        var cookie = { signedIn: true, user: usr };
        response.cookie('authData', cookie, copts).status(200).send().end();
    }, function () {
        response.status(400).send("UNAUTHORIZED").end();
        return;
    });
}
exports.resolve = resolve;
