"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthService_1 = require("../../services/AuthService");
var task_1 = require("../../schema/task");
var table_1 = require("../../schema/table");
function resolve(request, response, api) {
    var authData = AuthService_1.AuthService.extract(request);
    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end();
        return;
    }
    var taskID = request.query.task;
    var data = request.body;
    if (!data || !taskID) {
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
        if (data.title) {
            task.title = data.title;
        }
        if (data.stage) {
            task.stage = data.stage;
        }
        if (data.type) {
            task.type = data.type;
        }
        if (data.description) {
            task.description = data.description;
        }
        if (data.link) {
            task.link = data.link;
        }
        if (data.dueDate) {
            task.dueDate = new Date(data.dueDate);
        }
        if (data.course) {
            task.course = data.course;
        }
        if (data.complexity) {
            task.complexity = data.complexity;
        }
        if (data.colOrder) {
            task.colOrder = data.colOrder;
        }
        task.toJSON = task_1.Task.prototype.toJSON;
        api.update(taskID, task, table_1.Tables.Tasks, function () {
            response.status(200).send("SUCCEEDED").end();
        });
    });
}
exports.resolve = resolve;
