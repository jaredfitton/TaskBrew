import {User} from "./user";
import {Task} from "./task";
import {Course} from "./course";
import {UserSettings} from "./user_settings";

export interface JSONSerializable {
    id: string
    toJSON: () => Object
}

export interface Table<T extends JSONSerializable> {
    key: string,
    modelBuilder: (raw: object) => T | null
}

export class Tables {
    static Users = <Table<User>>{key: "users", modelBuilder: User.parse}
    static Tasks = <Table<Task>>{key: "tasks", modelBuilder: Task.parse}
    static Courses = <Table<Course>>{key: "courses", modelBuilder: Course.parse}
    static UserSettings = <Table<UserSettings>>{key: "user_settings", modelBuilder: UserSettings.parse}
}