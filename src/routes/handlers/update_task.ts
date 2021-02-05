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

    let data = <{ [key:string]:any }>request.body

    if (!data || !taskID) {
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

        if (data.title) {
            task.title = data.title
        }
        if (data.stage) {
            task.stage = data.stage
        }
        if (data.type) {
            task.type = data.type
        }
        if (data.description) {
            task.description = data.description
        }
        if (data.link) {
            task.link = data.link
        }
        if (data.dueDate) {
            task.dueDate = new Date(data.dueDate)
        }
        if (data.course) {
            task.course = data.course
        }
        if (data.complexity) {
            task.complexity = data.complexity
        }
        if (data.colOrder) {
            task.colOrder = data.colOrder
        }

        task.toJSON = Task.prototype.toJSON

        api.update(taskID, task, Tables.Tasks, () => {
            response.status(200).send("SUCCEEDED").end()
        })
    })
}

exports.resolve = resolve;