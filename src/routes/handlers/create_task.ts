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

    let data: {dueDate: string, complexity: number,
        title: string, description: string, type: TaskType, course?: string} = request.body

    if (!data) {
        response.status(400).send("BAD DATA").end()
        return
    }

    let newTask = new Task(authData.user!.id, data.title, "0", data.type, data.description, "",
        new Date(data.dueDate), data.course, data.complexity, 0)

    api.addEntry(newTask, Tables.Tasks, nid => {
        response.status(200).send("SUCCEEDED").end()
    })
}

exports.resolve = resolve;