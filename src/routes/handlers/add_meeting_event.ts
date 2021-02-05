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

    let data: {
        type: "Lab" | "Lecture" | "Office Hours",
        days: string,
        time: string,
        meetingLink?: string,
        location?: string} = request.body

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

        let event: MeetingEvent = {
            type: data.type,
            days: data.days,
            // time: new Date(data.time),
            meetingLink: data.meetingLink,
            location: data.location,
            idx: course.meetings.length
        }

        course.meetings.push(event)

        api.update(courseID, course, Tables.Courses, () => {
            response.send("SUCCEEDED").end()
        })
    })
}

exports.resolve = resolve;