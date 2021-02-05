"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
var table_1 = require("../../schema/table");
var course_1 = require("../../schema/course");
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end();
        return;
    }
    var data = request.body;
    if (!data) {
        response.status(400).send("BAD DATA").end();
        return;
    }
    var newCourse = new course_1.Course(authData.user.id, data.title, data.courseNum, data.color, [], [], data.professor);
    api.addEntry(newCourse, table_1.Tables.Courses, function (nid) {
        response.status(200).send("SUCCEEDED").end();
    });
}
exports.resolve = resolve;
