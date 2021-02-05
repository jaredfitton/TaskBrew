"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
var table_1 = require("../../schema/table");
var board_1 = require("./board");
function shouldDisplay(task, indx, arr) {
    if (!task) {
        return false;
    }
    var tdiff = task.dueDate.getTime() - Date.now();
    return tdiff >= 0 || task.stage !== "1";
}
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.redirect("/");
        return;
    }
    var courseID;
    if (request.query.hasOwnProperty('course')) {
        courseID = request.query.course;
    }
    else {
        response.status(400).send("No course was specified").end();
        return;
    }
    api.getByID(courseID, table_1.Tables.Courses, function (mcourse) {
        if (!mcourse) {
            response.status(500)
                .send("The server experienced an unexpected error and could not retrieve your data")
                .end();
            return;
        }
        var course = mcourse;
        if (course.owner != authData.user.id) {
            response.status(401).send("You do not have access to that course").end();
            return;
        }
        api.getByID(authData.user.settingsID, table_1.Tables.UserSettings, function (msettings) {
            if (!msettings) {
                response.status(500)
                    .send("The server experienced an unexpected error and could not retrieve your data")
                    .end();
                return;
            }
            var settings = msettings;
            var stageMap = {};
            settings.stages.forEach(function (stage) { return stageMap[stage.id] = stage; });
            api.getByOwner(authData.user.id, table_1.Tables.Tasks, function (mtasks) {
                if (!mtasks) {
                    response.status(500)
                        .send("The server experienced an unexpected error and could not retrieve your data")
                        .end();
                    return;
                }
                console.log("[/course-details] Maybe-Tasks: " + JSON.stringify(mtasks));
                var tasks = mtasks.filter(shouldDisplay)
                    .filter(function (task) { return task.course === courseID; })
                    .map(function (task) { return board_1.mapTask(task, stageMap, null); });
                var totalBeans = 0;
                var roastedBeans = 0;
                console.log("[/course-details] Tasks: " + JSON.stringify(tasks));
                var days = {};
                tasks.forEach(function (task) {
                    var dayKey = task.dueDate;
                    totalBeans += task.complexity;
                    if (task.done) {
                        roastedBeans += task.complexity;
                    }
                    if (days.hasOwnProperty(dayKey)) {
                        days[dayKey].push(task);
                    }
                    else {
                        days[dayKey] = [task];
                    }
                });
                console.log("[/course-details] Days: " + JSON.stringify(days));
                api.getCourseLinkData(authData.user.id, function (courseLinks) {
                    var _a;
                    var pageVars = {
                        page: {
                            title: course.title,
                            key: "course_detail"
                        },
                        user: {
                            loggedIn: authData.signedIn,
                            avatar: (_a = authData.user) === null || _a === void 0 ? void 0 : _a.avatarKey
                        },
                        days: days,
                        course: course,
                        completion: Math.trunc(((roastedBeans / totalBeans) * 100)),
                        course_links: courseLinks,
                        active_course: courseID
                    };
                    response.render('course_details', pageVars);
                });
            });
        });
    });
}
exports.resolve = resolve;
