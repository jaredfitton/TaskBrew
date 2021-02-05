import {APIService} from "../services/APIService";
import {UserSettings} from "./user_settings";
import {Tables} from "./table";

export class User {
    id: string
    token: string
    email: string
    name: string
    avatarKey: string
    settingsID: string

    constructor(token: string, email: string, name: string, avatarKey: string, settingsID: string) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.avatarKey = avatarKey;
        this.id = ""
        this.settingsID = settingsID
    }

    static parse(raw: Object): User | null {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("token")
            && raw.hasOwnProperty("email")
            && raw.hasOwnProperty("name")
            && raw.hasOwnProperty("avatarKey")
            && raw.hasOwnProperty("settingsID")) {
            return <User>raw
        }

        return null;
    }

    toJSON(): Object {
        return this
    }
}