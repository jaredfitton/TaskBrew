import {APIService} from "../../services/APIService";
import { Request, Response } from "express";
import {AuthService} from "../../services/AuthService";
import {Task, TaskType} from "../../schema/task";
import {Tables} from "../../schema/table";
import {StageConfig} from "../../schema/user_settings";
import {Course} from "../../schema/course";
import {HTMLTask} from "../pages/board";

interface FullTask {
    name: string,
    stageID: string,
    stage: string,
    stageColor: string,
    type: string,
    course: string,
    courseColor: string,
    courseID?: string,
    dueDate: string,
    dueTime: string,
    complexity: number,
    colOrder: number,
    overdue: boolean,
    done: boolean,
    id: string,
    description: string
}
function p2(n: number): string {
    return String(n).padStart(2, "0")
}

function mapTask(task: Task, stageMap: {[id:string]:StageConfig} | null,
                 course: Course | null): FullTask {
    let stage = stageMap ? stageMap[task.stage] : null

    let dueDate = `${task.dueDate.getFullYear()}-${p2(task.dueDate.getMonth()+1)}-${p2(task.dueDate.getDate())}`
    let dueTime = `${p2(task.dueDate.getHours())}:${p2(task.dueDate.getMinutes())}`

    return {
        name: task.title,
        stageID: task.stage,
        stage: stage ? stage.name : task.stage,
        stageColor: stage ? stage.color : "#FF0000",
        type: task.type,
        course: course ? course.courseNum : "General",
        courseColor: course ? course.color : "#db9372",
        courseID: task.course,
        dueDate: dueDate,
        dueTime: dueTime,
        complexity: task.complexity,
        colOrder: task.colOrder,
        overdue: task.dueDate.getTime() - Date.now() < 0,
        done: task.stage === "1",
        id: task.id,
        description: task.description
    }
}

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

        api.getByID(authData.user!.settingsID, Tables.UserSettings, settings => {
            if (!settings) {
                response.status(500).send("SERVER ERROR").end()
                return
            }

            let stageMap : {[key:string]:StageConfig} = {}
            settings.stages.forEach(stage => stageMap[stage.id] = stage)

            api.getByOwner(authData.user!.id, Tables.Courses, mcourses => {
                let courses: Course[]
                if (!mcourses) {
                    courses = []
                } else {
                    courses = <Course[]>mcourses!.filter(s => s != null)
                }

                let outTask = mapTask(task, stageMap, task.course ? courses.find(c => c.id == task.course)! : null)

                let retData = {
                    task: outTask,
                    courses: courses.map(c => <object>{'num': c.courseNum, 'id': c.id}),
                    stages: settings.stages
                }

                response.send(retData).end()
            })
        })
    })
}

exports.resolve = resolve;