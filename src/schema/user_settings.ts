export interface StageConfig {
    id: string // "To-Do" = 0; "Done" = 1
    name: string
    order: number
    color: string // Hex string
    locked: boolean
}

interface DBSettings {
    id: string
    stages: {[key:string]:StageConfig}
}

export class UserSettings {
    id: string
    stages: StageConfig[]

    constructor() {
        this.id = ""
        this.stages = [{id:"0", name:"To-Do", color: "#ffff00", locked: true, order: 0},
            {id:"1", name:"Done", color: "#00FF00", locked: true, order: 1}]
    }

    static parse(raw: Object): UserSettings | null {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("stages")) {
            let tem = <DBSettings>raw

            let stages: StageConfig[] = []
            Object.entries(tem.stages).forEach(([key, value]) => stages.push(value))

            let out = new UserSettings()
            out.stages = stages
            out.id = tem.id

            return out
        }



        return null;
    }

    toJSON(): Object {
        return this
    }
}