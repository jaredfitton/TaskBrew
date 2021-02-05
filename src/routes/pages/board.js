"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeek = exports.shouldDisplay = exports.mapTask = void 0;
var AuthService_1 = require("../../services/AuthService");
var table_1 = require("../../schema/table");
function mapTask(task, stageMap, courseMap) {
    var stage = stageMap ? stageMap[task.stage] : null;
    var course = task.course && courseMap ? courseMap[task.course] : null;
    return {
        name: task.title,
        stage: stage ? stage.name : task.stage,
        stageColor: stage ? stage.color : "#FF0000",
        type: task.type,
        course: course ? course.courseNum : "General",
        courseColor: course ? course.color : "#db9372",
        dueDate: task.dueDate.toISOString(),
        complexity: task.complexity,
        colOrder: task.colOrder,
        overdue: task.dueDate.getTime() - Date.now() < 0,
        done: task.stage === "1",
        id: task.id
    };
}
exports.mapTask = mapTask;
function shouldDisplay(task, indx, arr) {
    if (!task) {
        return false;
    }
    var time = Date.now();
    var tdiff = task.dueDate.getTime() - time;
    return (tdiff > 0 && tdiff < 604800000)
        || (tdiff < 0 && task.stage !== "1")
        || (tdiff > 0 && tdiff < 950400000 && task.stage === "0");
}
exports.shouldDisplay = shouldDisplay;
function isThisWeek(task) {
    var time = Date.now();
    var tdiff = Date.parse(task.dueDate) - time;
    return (tdiff > 0 && tdiff < 604800000);
}
function getWeek(day) {
    var now;
    if (day) {
        now = day;
    }
    else {
        now = new Date();
    }
    var dow = now.getDay() - 1;
    if (dow < 0) {
        dow = 6;
    }
    var lastMonMilli = now.getTime() - (dow * 86400000);
    var lastMon = new Date(lastMonMilli);
    var nextSun = new Date(lastMonMilli + 518400000);
    var iny = lastMon.getFullYear() != nextSun.getFullYear();
    var fd = lastMon.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    var ndo = { month: 'short', day: 'numeric', year: iny ? 'numeric' : undefined };
    var nd = nextSun.toLocaleDateString(undefined, ndo);
    return fd + " - " + nd;
}
exports.getWeek = getWeek;
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.redirect("/");
    }
    api.getByOwner(authData.user.id, table_1.Tables.Tasks, function (mtasks) {
        var tasks;
        if (!mtasks) {
            tasks = [];
        }
        else {
            tasks = mtasks.filter(shouldDisplay);
        }
        api.getByID(authData.user.settingsID, table_1.Tables.UserSettings, function (msettings) {
            if (!msettings) {
                response.status(500)
                    .send("The server experienced an unexpected error and could not retrieve your data")
                    .end();
                return;
            }
            var settings = msettings;
            api.getByOwner(authData.user.id, table_1.Tables.Courses, function (mcourses) {
                var courses;
                if (!mcourses) {
                    courses = [];
                }
                else {
                    courses = mcourses;
                }
                var courseMap = {};
                courses.forEach(function (course) {
                    if (!course) {
                        return;
                    }
                    courseMap[course.id] = course;
                });
                var cols = {};
                settings.stages.forEach(function (stage) {
                    cols[stage.id] = { title: stage.name, color: stage.color, tasks: [] };
                });
                var totalBeans = 0;
                var roastedBeans = 0;
                tasks.map(function (task) { return mapTask(task, null, courseMap); }).forEach(function (task) {
                    cols[task.stage].tasks.push(task);
                    if (isThisWeek(task)) {
                        totalBeans += task.complexity;
                        if (task.done) {
                            roastedBeans += task.complexity;
                        }
                    }
                });
                var colList = Object.keys(cols).map(function (key) { return cols[key]; });
                colList.forEach(function (col) { return col.tasks.sort(function (a, b) { return (a.colOrder - b.colOrder); }); });
                api.getCourseLinkData(authData.user.id, function (courseLinks) {
                    var _a;
                    var pageVars = {
                        page: {
                            title: "Task Board",
                            key: "board"
                        },
                        user: {
                            loggedIn: authData.signedIn,
                            avatar: (_a = authData.user) === null || _a === void 0 ? void 0 : _a.avatarKey
                        },
                        columns: colList,
                        date_range: getWeek(),
                        completion: Math.trunc(((roastedBeans / totalBeans) * 100)),
                        course_links: courseLinks
                    };
                    response.render('board', pageVars);
                });
            });
        });
    });
}
exports.resolve = resolve;
