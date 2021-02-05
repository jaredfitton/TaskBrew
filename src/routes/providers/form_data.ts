import {APIService} from "../../services/APIService";
import { Request, Response } from "express";
import {AuthService} from "../../services/AuthService";
import {Task, TaskType} from "../../schema/task";
import {Tables} from "../../schema/table";
import {StageConfig} from "../../schema/user_settings";
import {Course} from "../../schema/course";
import {HTMLTask} from "../pages/board";


function resolve(request: Request, response: Response, api: APIService) {
    let authData = AuthService.extract(request);

    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end()
        return;
    }

    api.getByID(authData.user!.settingsID, Tables.UserSettings, settings => {
        if (!settings) {
            response.status(500).send("SERVER ERROR").end()
            return
        }

        api.getByOwner(authData.user!.id, Tables.Courses, mcourses => {
            let courses: Course[]
            if (!mcourses) {
                courses = []
            } else {
                courses = <Course[]>mcourses!.filter(s => s != null)
            }

            let retData = {
                courses: courses.map(c => <object>{'num': c.courseNum, 'id': c.id}),
                stages: settings.stages
            }

            response.send(retData).end()
        })
    })
}

exports.resolve = resolve;