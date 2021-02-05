import {APIService} from "../../services/APIService";
import { Request, Response } from "express";
import {AuthService} from "../../services/AuthService";
import {Task, TaskType} from "../../schema/task";
import {Tables} from "../../schema/table";

function resolve(request: Request, response: Response, api: APIService) {
    let authData = AuthService.extract(request);

    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end()
        return;
    }

    let taskID = <string>request.query.task

    if (!taskID) {
        response.status(400).send("BAD DATA").end()
        return
    }

    api.getByID(taskID, Tables.Tasks, task => {
        if (!task) {
            response.status(400).send("NO SUCH TASK").end()
            return
        } else if (task.owner !== authData.user!.id) {
            response.status(401).send("NOT AUTHORIZED").end()
            return;
        }

        api.deleteEntry(taskID, Tables.Tasks, () => {
            response.status(200).send("SUCCEEDED").end()
        })
    })
}

exports.resolve = resolve;