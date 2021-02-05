import {APIService} from "../../services/APIService";
import {Request, Response} from "express";
import {AuthService} from "../../services/AuthService";
import {Tables} from "../../schema/table";
import {Task} from "../../schema/task";
import {HTMLTask, mapTask} from "./board";
import {Course} from "../../schema/course";
import {StageConfig} from "../../schema/user_settings";

function shouldDisplay(task: Task | null, indx: number, arr: (Task | null)[]): boolean {
    if (!task) {
        return false
    }

    let tdiff = task!.dueDate.getTime() - Date.now()

    return tdiff >= 0 || task.stage !== "1"
}

function resolve(request: Request, response: Response, api: APIService) {
    let authData = AuthService.extract(request);

    if (!authData.signedIn) {
        response.redirect("/")
        return
    }

    let courseID: string
    if (request.query.hasOwnProperty('course')) {
        courseID = <string>request.query.course
    } else {
        response.status(400).send("No course was specified").end()
        return;
    }

    api.getByID(courseID, Tables.Courses, mcourse => {
        if (!mcourse) {
            response.status(500)
                .send("The server experienced an unexpected error and could not retrieve your data")
                .end()
            return
        }
        let course = <Course>mcourse!

        if (course.owner != authData.user!.id) {
            response.status(401).send("You do not have access to that course").end()
            return;
        }

        api.getByID(authData.user!.settingsID, Tables.UserSettings, msettings => {
            if (!msettings) {
                response.status(500)
                    .send("The server experienced an unexpected error and could not retrieve your data")
                    .end()
                return
            }
            let settings = msettings!
            let stageMap : {[key:string]:StageConfig} = {}
            settings.stages.forEach(stage => stageMap[stage.id] = stage)

            api.getByOwner(authData.user!.id, Tables.Tasks, mtasks => {
                if(!mtasks) {
                    response.status(500)
                        .send("The server experienced an unexpected error and could not retrieve your data")
                        .end()
                    return
                }
                console.log(`[/course-details] Maybe-Tasks: ${JSON.stringify(mtasks)}`)
                let tasks = (<Task[]>mtasks!.filter(shouldDisplay))
                    .filter(task => task.course === courseID)
                    .map(task => mapTask(task, stageMap, null))

                var totalBeans = 0
                var roastedBeans = 0

                console.log(`[/course-details] Tasks: ${JSON.stringify(tasks)}`)

                let days : {[day:string]:HTMLTask[]} = {}
                tasks.forEach(task => {
                    let dayKey = task.dueDate

                    totalBeans += task.complexity
                    if (task.done) {
                        roastedBeans += task.complexity
                    }

                    if (days.hasOwnProperty(dayKey)) {
                        days[dayKey].push(task)
                    } else {
                        days[dayKey] = [task]
                    }
                })

                console.log(`[/course-details] Days: ${JSON.stringify(days)}`)

                api.getCourseLinkData(authData.user!.id, courseLinks => {
                    let pageVars = {
                        page: {
                            title: course.title,
                            key: "course_detail"
                        },
                        user: {
                            loggedIn: authData.signedIn,
                            avatar: authData.user?.avatarKey
                        },
                        days: days,
                        course: course,
                        completion: Math.trunc(((roastedBeans/totalBeans) * 100)),
                        course_links: courseLinks,
                        active_course: courseID
                    }

                    response.render('course_details', pageVars);
                })
            })
        })
    })
}

exports.resolve = resolve;