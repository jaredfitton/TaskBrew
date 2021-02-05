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
    var courseID = request.query.course;
    var data = request.body;
    if (!data || !courseID) {
        response.status(400).send("BAD DATA").end();
        return;
    }
    api.getByID(courseID, table_1.Tables.Courses, function (course) {
        if (!course) {
            response.status(400).send("NO SUCH TASK").end();
            return;
        }
        else if (course.owner !== authData.user.id) {
            response.status(401).send("NOT AUTHORIZED").end();
            return;
        }
        var event = {
            type: data.type,
            days: data.days,
            // time: new Date(data.time),
            meetingLink: data.meetingLink,
            location: data.location,
            idx: course.meetings.length
        };
        course.meetings.push(event);
        api.update(courseID, course, table_1.Tables.Courses, function () {
            response.send("SUCCEEDED").end();
        });
    });
}
exports.resolve = resolve;
