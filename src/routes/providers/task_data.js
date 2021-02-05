"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
var table_1 = require("../../schema/table");
function p2(n) {
    return String(n).padStart(2, "0");
}
function mapTask(task, stageMap, course) {
    var stage = stageMap ? stageMap[task.stage] : null;
    var dueDate = task.dueDate.getFullYear() + "-" + p2(task.dueDate.getMonth() + 1) + "-" + p2(task.dueDate.getDate());
    var dueTime = p2(task.dueDate.getHours()) + ":" + p2(task.dueDate.getMinutes());
    return {
        name: task.title,
        stageID: task.stage,
        stage: stage ? stage.name : task.stage,
        stageColor: stage ? stage.color : "#FF0000",
        type: task.type,
        course: course ? course.courseNum : "General",
        courseColor: course ? course.color : "#db9372",
        courseID: task.course,
        dueDate: dueDate,
        dueTime: dueTime,
        complexity: task.complexity,
        colOrder: task.colOrder,
        overdue: task.dueDate.getTime() - Date.now() < 0,
        done: task.stage === "1",
        id: task.id,
        description: task.description
    };
}
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end();
        return;
    }
    var taskID = request.query.task;
    if (!taskID) {
        response.status(400).send("BAD DATA").end();
        return;
    }
    api.getByID(taskID, table_1.Tables.Tasks, function (task) {
        if (!task) {
            response.status(400).send("NO SUCH TASK").end();
            return;
        }
        else if (task.owner !== authData.user.id) {
            response.status(401).send("NOT AUTHORIZED").end();
            return;
        }
        api.getByID(authData.user.settingsID, table_1.Tables.UserSettings, function (settings) {
            if (!settings) {
                response.status(500).send("SERVER ERROR").end();
                return;
            }
            var stageMap = {};
            settings.stages.forEach(function (stage) { return stageMap[stage.id] = stage; });
            api.getByOwner(authData.user.id, table_1.Tables.Courses, function (mcourses) {
                var courses;
                if (!mcourses) {
                    courses = [];
                }
                else {
                    courses = mcourses.filter(function (s) { return s != null; });
                }
                var outTask = mapTask(task, stageMap, task.course ? courses.find(function (c) { return c.id == task.course; }) : null);
                var retData = {
                    task: outTask,
                    courses: courses.map(function (c) { return ({ 'num': c.courseNum, 'id': c.id }); }),
                    stages: settings.stages
                };
                response.send(retData).end();
            });
        });
    });
}
exports.resolve = resolve;
