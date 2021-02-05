export interface Weekday {
    name: string
    abbrv: string
}

export class Weekdays {
    static SUNDAY = {name: 'Sunday', abbrv: 'Sun.'}
    static MONDAY = {name: 'Monday', abbrv: 'Mon.'}
    static TUESDAY = {name: 'Tuesday', abbrv: 'Tue.'}
    static WEDNESDAY = {name: 'Wednesday', abbrv: 'Wed.'}
    static THURSDAY = {name: 'Thursday', abbrv: 'Thur.'}
    static FRIDAY = {name: 'Friday', abbrv: 'Fri.'}
    static SATURDAY = {name: 'Saturday', abbrv: 'Sat.'}
}

export interface MeetingEvent {
    type: "Lab" | "Lecture" | "Office Hours"
    days: String
    meetingLink?: string
    location?: String
    idx: number
}

interface DBMeetingEvent {
    type: "Lab" | "Lecture" | "Office Hours"
    days: String
    meetingLink?: string
    location?: String
}

function cvtMeetingEvent(idx: number, event: DBMeetingEvent): MeetingEvent {
    return {
        type: event.type,
        days: event.days,
        meetingLink: event.meetingLink,
        location: event.location,
        idx: idx
    }
}

interface DBCourse {
    owner: string
    id: string
    title: string
    courseNum: string
    color: string // Hex color
    resources: {[id:string]:CourseResource}
    meetings: { [id:string]: DBMeetingEvent }
    professor?: string
}

export interface CourseResource {
    title: string,
    link: string
}

export class Course {
    owner: string
    id: string
    title: string
    courseNum: string
    color: string // Hex color
    resources: CourseResource[]
    meetings: MeetingEvent[]
    professor?: string

    constructor(owner: string, title: string, courseNum: string, color: string, resources: CourseResource[], meetings: MeetingEvent[], professor?: string) {
        this.owner = owner;
        this.title = title;
        this.courseNum = courseNum;
        this.color = color;
        this.resources = resources;
        this.meetings = meetings;
        this.professor = professor;
        this.id = "";
    }

    static parse(raw: object): Course | null {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("owner")
            && raw.hasOwnProperty("title")
            && raw.hasOwnProperty("courseNum")
            && raw.hasOwnProperty("color")) {

            let ro = <{[key:string]:any}>raw

            if (!ro.hasOwnProperty("meetings")) {
                ro['meetings'] = {}
            }

            if (!ro.hasOwnProperty("resources")) {
                ro['resources'] = {}
            }

            let tem = <DBCourse>ro

            let resources: {title: string, link: string}[] = []
            Object.entries(tem.resources).forEach(([key, value]) => resources.push(value))

            let meetings: DBMeetingEvent[] = []
            Object.entries(tem.meetings).forEach(([key, value]) => meetings.push(value))

            let out = new Course(tem.owner, tem.title, tem.courseNum, tem.color, resources,
                meetings.map((v,i,a) => cvtMeetingEvent(i, v)), tem.professor)
            out.id = tem.id

            return out
        }

        console.log(`[Course] Data was rejected as it was missing required keys`)
        console.log(`\thas key 'id': ${raw.hasOwnProperty('id')}`)
        console.log(`\thas key 'owner': ${raw.hasOwnProperty('owner')}`)
        console.log(`\thas key 'title': ${raw.hasOwnProperty('title')}`)
        console.log(`\thas key 'courseNum': ${raw.hasOwnProperty('courseNum')}`)
        console.log(`\thas key 'resources': ${raw.hasOwnProperty('resources')}`)
        console.log(`\thas key 'meetings': ${raw.hasOwnProperty('meetings')}`)
        console.log(`\thas key 'color': ${raw.hasOwnProperty('color')}`)
        return null;
    }

    toJSON(): Object {
        this.meetings.forEach(meet => {
            if (!meet.meetingLink) {
                delete meet['meetingLink']
            }

            if (!meet.location) {
                delete meet['location']
            }
        })

        return this
    }
}