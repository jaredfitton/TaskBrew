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
        api.deleteEntry(taskID, table_1.Tables.Tasks, function () {
            response.status(200).send("SUCCEEDED").end();
        });
    });
}
exports.resolve = resolve;
