"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
var table_1 = require("../../schema/table");
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end();
        return;
    }
    api.getByID(authData.user.settingsID, table_1.Tables.UserSettings, function (settings) {
        if (!settings) {
            response.status(500).send("SERVER ERROR").end();
            return;
        }
        api.getByOwner(authData.user.id, table_1.Tables.Courses, function (mcourses) {
            var courses;
            if (!mcourses) {
                courses = [];
            }
            else {
                courses = mcourses.filter(function (s) { return s != null; });
            }
            var retData = {
                courses: courses.map(function (c) { return ({ 'num': c.courseNum, 'id': c.id }); }),
                stages: settings.stages
            };
            response.send(retData).end();
        });
    });
}
exports.resolve = resolve;
