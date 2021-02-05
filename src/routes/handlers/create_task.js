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
    var data = request.body;
    if (!data) {
        response.status(400).send("BAD DATA").end();
        return;
    }
    var newTask = new task_1.Task(authData.user.id, data.title, "0", data.type, data.description, "", new Date(data.dueDate), data.course, data.complexity, 0);
    api.addEntry(newTask, table_1.Tables.Tasks, function (nid) {
        response.status(200).send("SUCCEEDED").end();
    });
}
exports.resolve = resolve;
