"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
var table_1 = require("../../schema/table");
var board_1 = require("./board");
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.redirect("/");
        return;
    }
    api.getByOwner(authData.user.id, table_1.Tables.Tasks, function (mtasks) {
        if (!mtasks) {
            response.status(500)
                .send("The server experienced an unexpected error and could not retrieve your data")
                .end();
            return;
        }
        var tasks = mtasks.filter(board_1.shouldDisplay);
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
            api.getByOwner(authData.user.id, table_1.Tables.Courses, function (mcourses) {
                var _a;
                if (!mcourses) {
                    response.status(500)
                        .send("The server experienced an unexpected error and could not retrieve your data")
                        .end();
                    return;
                }
                var courses = mcourses;
                var courseMap;
                courses.forEach(function (course) {
                    if (!course) {
                        return;
                    }
                    courseMap[course.id] = course;
                });
                var weeks = {};
                tasks.map(function (task) { return board_1.mapTask(task, stageMap, courseMap); }).forEach(function (task) {
                    var weekKey = board_1.getWeek(new Date(task.dueDate));
                    var dayKey = task.dueDate;
                    if (weeks.hasOwnProperty(weekKey)) {
                        if (weeks[weekKey].hasOwnProperty(dayKey)) {
                            weeks[weekKey][dayKey].push(task);
                        }
                        else {
                            weeks[weekKey][dayKey] = [task];
                        }
                    }
                    else {
                        weeks[weekKey] = {};
                        weeks[weekKey][dayKey] = [task];
                    }
                });
                var pageVars = {
                    page: {
                        title: "Master List",
                        key: "master_list"
                    },
                    user: {
                        loggedIn: authData.signedIn,
                        avatar: (_a = authData.user) === null || _a === void 0 ? void 0 : _a.avatarKey
                    },
                    weeks: weeks
                };
                response.render('list', pageVars);
            });
        });
    });
}
exports.resolve = resolve;
