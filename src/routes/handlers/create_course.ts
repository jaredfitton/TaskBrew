import {APIService} from "../../services/APIService";
import {Request, Response} from "express";
import {AuthService} from "../../services/AuthService";
import {Tables} from "../../schema/table";
import {Course} from "../../schema/course";

function resolve(request: Request, response: Response, api: APIService) {
    let authData = AuthService.extract(request);

    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end()
        return;
    }

    let data: {title: string, courseNum: string, color: string, professor?: string} = request.body

    if (!data) {
        response.status(400).send("BAD DATA").end()
        return
    }

    let newCourse = new Course(authData.user!.id, data.title, data.courseNum, data.color, [], [], data.professor)

    api.addEntry(newCourse, Tables.Courses, nid => {
        response.status(200).send("SUCCEEDED").end()
    })
}

exports.resolve = resolve;