import {APIService} from "../../services/APIService";
import {Request, Response} from "express";
import {AuthService} from "../../services/AuthService";
import {Tables} from "../../schema/table";
import {Course, MeetingEvent} from "../../schema/course";

function resolve(request: Request, response: Response, api: APIService) {
    let authData = AuthService.extract(request);

    if (!authData.signedIn) {
        response.status(401).send("NOT AUTHORIZED").end()
        return;
    }

    let courseID: string = <string>request.query.course

    let data: {title: string, link: string} = request.body

    if (!data || !courseID) {
        response.status(400).send("BAD DATA").end()
        return
    }

    api.getByID(courseID, Tables.Courses, course => {
        if (!course) {
            response.status(400).send("NO SUCH TASK").end()
            return
        } else if (course!.owner !== authData.user!.id) {
            response.status(401).send("NOT AUTHORIZED").end()
            return;
        }

        course.resources.push(data)

        api.update(courseID, course, Tables.Courses, () => {
            response.send("SUCCEEDED").end()
        })
    })
}

exports.resolve = resolve;