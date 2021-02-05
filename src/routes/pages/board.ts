import {APIService} from "../../services/APIService";
import { Request, Response } from "express";
import {AuthService} from "../../services/AuthService";
import {Tables} from "../../schema/table";
import {Task} from "../../schema/task";
import {StageConfig} from "../../schema/user_settings";
import {Course} from "../../schema/course";

interface Column {
    title: string
    color: string
    tasks: HTMLTask[]
}

export interface HTMLTask {
    name: string,
    stage: string,
    stageColor: string,
    type: string,
    course: string,
    courseColor: string,
    dueDate: string,
    complexity: number,
    colOrder: number,
    overdue: boolean,
    done: boolean,
    id: string
}

export function mapTask(task: Task, stageMap: {[id:string]:StageConfig} | null,
                        courseMap: {[id:string]:Course} | null): HTMLTask {
    let stage = stageMap ? stageMap[task.stage] : null
    let course = task.course && courseMap ? courseMap[task.course] : null

    return {
        name: task.title,
        stage: stage ? stage.name : task.stage,
        stageColor: stage ? stage.color : "#FF0000",
        type: task.type,
        course: course ? course.courseNum : "General",
        courseColor: course ? course.color : "#db9372",
        dueDate: task.dueDate.toISOString(),
        complexity: task.complexity,
        colOrder: task.colOrder,
        overdue: task.dueDate.getTime() - Date.now() < 0,
        done: task.stage === "1",
        id: task.id
    }
}

export function shouldDisplay(task: Task | null, indx: number, arr: (Task | null)[]): boolean {
    if (!task) {
        return false
    }

    let time = Date.now()

    let tdiff = task.dueDate.getTime() - time;

    return (tdiff > 0 && tdiff < 604800000)
        || (tdiff < 0 && task.stage !== "1")
        || (tdiff > 0 && tdiff < 950400000 && task.stage === "0")
}

function isThisWeek(task: HTMLTask): boolean {
    let time = Date.now()

    let tdiff = Date.parse(task.dueDate) - time;

    return (tdiff > 0 && tdiff < 604800000)
}

export function getWeek(day?:Date): string {
    let now;
    if (day) {
        now = day
    } else {
        now = new Date()
    }

    let dow = now.getDay() - 1
    if (dow < 0) {
        dow = 6
    }

    let lastMonMilli = now.getTime() - (dow * 86400000)
    let lastMon = new Date(lastMonMilli)
    let nextSun = new Date(lastMonMilli + 518400000)

    let iny = lastMon.getFullYear() != nextSun.getFullYear()

    let fd = lastMon.toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'})
    let ndo = {month:'short', day:'numeric', year:iny ? 'numeric' : undefined}
    let nd = nextSun.toLocaleDateString(undefined, ndo)

    return `${fd} - ${nd}`
}

function resolve(request: Request, response: Response, api: APIService) {
    let authData = AuthService.extract(request);

    if (!authData.signedIn) {
        response.redirect("/")
    }

    api.getByOwner(authData.user!.id, Tables.Tasks, mtasks => {
        let tasks : Task[]
        if (!mtasks) {
            tasks = []
        } else {
            tasks = <Task[]>mtasks!.filter(shouldDisplay)
        }

        api.getByID(authData.user!.settingsID, Tables.UserSettings, msettings => {
            if (!msettings) {
                response.status(500)
                    .send("The server experienced an unexpected error and could not retrieve your data")
                    .end()
                return
            }
            let settings = msettings!

            api.getByOwner(authData.user!.id, Tables.Courses, mcourses => {
                let courses : (Course | null)[]
                if(!mcourses) {
                    courses = []
                } else {
                    courses = mcourses!
                }

                let courseMap : {[key:string]: Course} = {}
                courses.forEach(course => {
                    if (!course) {
                        return
                    }
                    courseMap[course.id] = course
                })

                let cols: { [key:string]:Column } = {}
                settings.stages.forEach( stage => {
                    cols[stage.id] = {title: stage.name, color: stage.color, tasks: []}
                })

                var totalBeans = 0
                var roastedBeans = 0

                tasks.map(task => mapTask(task, null, courseMap)).forEach(task => {
                    cols[task.stage].tasks.push(task)

                    if (isThisWeek(task)) {
                        totalBeans += task.complexity
                        if (task.done) {
                            roastedBeans += task.complexity
                        }
                    }
                })

                let colList = Object.keys(cols).map(key => cols[key])
                colList.forEach(col => col.tasks.sort((a,b) => (a.colOrder - b.colOrder)))

                api.getCourseLinkData(authData.user!.id, courseLinks => {
                    let pageVars = {
                        page: {
                            title: "Task Board",
                            key: "board"
                        },
                        user: {
                            loggedIn: authData.signedIn,
                            avatar: authData.user?.avatarKey
                        },
                        columns: colList,
                        date_range: getWeek(),
                        completion: Math.trunc(((roastedBeans / totalBeans) * 100)),
                        course_links: courseLinks
                    }

                    response.render('board', pageVars);
                })
            })
        })
    })
}

exports.resolve = resolve;