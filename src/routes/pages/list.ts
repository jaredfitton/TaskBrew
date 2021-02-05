import {APIService} from "../../services/APIService";
import { Request, Response } from "express";
import {AuthService} from "../../services/AuthService";
import {Tables} from "../../schema/table";
import {Task} from "../../schema/task";
import {getWeek, HTMLTask, mapTask, shouldDisplay} from "./board";
import {Course} from "../../schema/course";
import {StageConfig} from "../../schema/user_settings";

function resolve(request: Request, response: Response, api: APIService) {
    let authData = AuthService.extract(request);

    if (!authData.signedIn) {
        response.redirect("/")
        return
    }

    api.getByOwner(authData.user!.id, Tables.Tasks, mtasks => {
        if (!mtasks) {
            response.status(500)
                .send("The server experienced an unexpected error and could not retrieve your data")
                .end()
            return
        }
        let tasks = <Task[]>mtasks!.filter(shouldDisplay)

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



            api.getByOwner(authData.user!.id, Tables.Courses, mcourses => {
                if(!mcourses) {
                    response.status(500)
                        .send("The server experienced an unexpected error and could not retrieve your data")
                        .end()
                    return
                }
                let courses = mcourses!
                let courseMap : {[key:string]: Course}
                courses.forEach(course => {
                    if (!course) {
                        return
                    }
                    courseMap[course.id] = course
                })

                let weeks: {[week:string]:{[day:string]:HTMLTask[]}} = {}

                tasks.map(task => mapTask(task, stageMap, courseMap)).forEach(task => {
                    let weekKey = getWeek(new Date(task.dueDate))
                    let dayKey = task.dueDate
                    if (weeks.hasOwnProperty(weekKey)) {
                        if (weeks[weekKey].hasOwnProperty(dayKey)) {
                            weeks[weekKey][dayKey].push(task)
                        } else {
                            weeks[weekKey][dayKey] = [task]
                        }
                    } else {
                        weeks[weekKey] = {}
                        weeks[weekKey][dayKey] = [task]
                    }
                })

                let pageVars = {
                    page: {
                        title: "Master List",
                        key: "master_list"
                    },
                    user: {
                        loggedIn: authData.signedIn,
                        avatar: authData.user?.avatarKey
                    },
                    weeks: weeks
                }

                response.render('list', pageVars);
            })
        })
    })
}

exports.resolve = resolve;