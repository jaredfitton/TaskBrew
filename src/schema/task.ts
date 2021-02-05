export type TaskType = "Assignment" | "Reading" | "Project" | "Exam" | "Quiz" | "Task"

export class Task {
    owner: string
    id: string
    title: string
    stage: string
    type: TaskType
    description: string
    link?: string
    dueDate: Date
    course?: string
    complexity: number
    colOrder: number


    constructor(owner: string, title: string, stage: string,
                type: "Assignment" | "Reading" | "Project" | "Exam" | "Quiz" | "Task", description: string,
                link: string, dueDate: Date, course: string | undefined, complexity: number, colOrder: number) {
        this.owner = owner;
        this.title = title;
        this.stage = stage;
        this.type = type;
        this.description = description;
        this.link = link;
        this.dueDate = dueDate;
        this.course = course;
        this.complexity = complexity;
        this.colOrder = colOrder;
        this.id = "";
    }

    static parse(raw: Object): Task | null {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("owner")
            && raw.hasOwnProperty("title")
            && raw.hasOwnProperty("stage")
            && raw.hasOwnProperty("type")
            && raw.hasOwnProperty("description")
            && raw.hasOwnProperty("dueDate")
            && raw.hasOwnProperty("complexity")
            && raw.hasOwnProperty("colOrder")) {
            let tem = <Task>raw

            tem.dueDate = new Date(tem.dueDate)

            return tem
        }

        console.log(`[Task] Data was rejected as it was missing required keys`)
        console.log(`\thas key 'id': ${raw.hasOwnProperty('id')}`)
        console.log(`\thas key 'owner': ${raw.hasOwnProperty('owner')}`)
        console.log(`\thas key 'title': ${raw.hasOwnProperty('title')}`)
        console.log(`\thas key 'stage': ${raw.hasOwnProperty('stage')}`)
        console.log(`\thas key 'type': ${raw.hasOwnProperty('type')}`)
        console.log(`\thas key 'description': ${raw.hasOwnProperty('description')}`)
        console.log(`\thas key 'dueDate': ${raw.hasOwnProperty('dueDate')}`)
        console.log(`\thas key 'complexity': ${raw.hasOwnProperty('complexity')}`)
        console.log(`\thas key 'colOrder': ${raw.hasOwnProperty('colOrder')}`)

        return null;
    }

    toJSON(): Object {
        let out = <{[key:string]:any}>this

        if (this.dueDate.getTime) {
            out['dueDate'] = this.dueDate.getTime()
        }

        return out
    }
}