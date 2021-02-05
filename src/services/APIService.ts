import {database, auth as ax} from "firebase-admin"
import {JSONSerializable, Table, Tables} from "../schema/table";
import {Course} from "../schema/course";
import {User} from "../schema/user";
import {UserSettings} from "../schema/user_settings";

let https = require('https');
let http = require('http');

export class APIService {
    db: database.Database
    auth: ax.Auth

    constructor(db: database.Database, auth: ax.Auth) {
        this.db = db;
        this.auth = auth;
    }

    getByID<T extends JSONSerializable>(id: string, table: Table<T>, andThen: (data: T | null) => void) {
        let ref = this.db.ref(`${table.key}/${id}`)
        console.log(`[APIService] Grabbing entry ${id} from table ${table.key}`)

        ref.once("value").then(data => {
            let x = data.toJSON()
            console.log(`\t[${table.key}/${id}] Received reply: ${JSON.stringify(x)}`)
            if (x == null) {
                andThen(null)
            } else {
                let construct = table.modelBuilder(<Object>x)

                if (construct == null) {
                    console.log(`\t[${table.key}/${id}] Model Builder failed to construct object`)
                }

                andThen(construct)
            }
        })//.catch(reason => console.log(`[APIService] Request to database was rejected: ${reason}`))
    }

    getByOwner<T extends JSONSerializable>(ownerID: string, table: Table<T>,
                                           andThen: (data: (T | null)[] | null) => void) {
        this.getByKey('owner', ownerID, table, andThen)
    }

    getByKey<T extends JSONSerializable>(key: string, value: string, table: Table<T>,
                                           andThen: (data: (T | null)[] | null) => void) {
        let ref = this.db.ref(table.key)
        let query = ref.orderByChild(key).equalTo(value);
        console.log(`[APIService] Performing query on table ${table.key}: ${key}=${value}`)

        query.once("value").then(data => {
            let x = data.toJSON()
            console.log(`\t[? ${key}=${value}] Received reply: ${JSON.stringify(x)}`)
            if (x == null) {
                andThen(null)
            } else {
                let resultList: (T | null)[] = []
                Object.entries(x).forEach( ([idx, value]) => {
                    let cons = table.modelBuilder(<object>value)

                    if (cons == null) {
                        console.log(`\t[? ${key}=${value}] Model Builder failed to construct reply index ${idx} (${JSON.stringify(value)})`)
                    }

                    resultList.push(cons)
                })
                andThen(resultList)
            }
        })
    }

    update<T extends JSONSerializable>(id: string, value: T, table: Table<T>, then?: () => void) {
        let ref = this.db.ref(`${table.key}/${id}`)

        // console.log(JSON.stringify(value))
        let data = <{ [key:string]:any }>((<T>value).toJSON())
        Object.keys(data).forEach(key => {
            if (data[key] === undefined || typeof data[key] === "function") {
                delete data[key]
            }
        })

        console.log(`[APIService] Updating data: ${JSON.stringify(data)}`)

        let promise = ref.set(data)

        if (then) {
            promise.then(() => then!())
        }
    }

    addEntry<T extends JSONSerializable>(entry: T, table: Table<T>, then?: (newID: string) => void) {
        let ref = this.db.ref(table.key)
        let npost = ref.push();

        entry.id = <string>npost.key

        let data = <{ [key:string]:any }>entry.toJSON()
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

        let promise = npost.set(data)

        if (then) {
            promise.then(() => then!(entry.id))
        }
    }

    deleteEntry(id: string, table: Table<any>, then?: () => void) {
        let ref = this.db.ref(`${table.key}/${id}`)
        let promise = ref.set(null)

        if (then) {
            promise.then(() => then!())
        }
    }

    getOrCreateAuthUser(token: string, andThen: (usr: User) => void, fail: () => void) {
        this.auth.verifyIdToken(token).then(data => {
            this.getByKey('token', data.uid, Tables.Users, matches => {
                if (!matches) {
                    this.createUser(data.uid, andThen, fail)
                } else if (matches!.length < 1) {
                    this.createUser(data.uid, andThen, fail)
                } else {
                    let match = matches[0]
                    if (!match) {
                        console.log(`[APIService] Retrieved bad user data`)
                        fail()
                    }

                    andThen(match!)
                }
            })
        }, bad => fail())
    }

    createUser(uid: string, andThen: (usr: User) => void, fail: () => void) {
        this.auth.getUser(uid).then(record => {
            let user = new User(uid, record.email!, record.displayName || "", "joe", "")
            let settings = new UserSettings()

            this.addEntry(settings, Tables.UserSettings, settingsID => {
                user.settingsID = settingsID
                this.addEntry(user, Tables.Users, userID => {
                    user.id = userID
                    andThen(user)
                })
            })
        }, bad => fail())
    }

    getCourseLinkData(owner: string, andThen: (courses: {name:string, id:string}[]) => void) {
        this.getByOwner(owner, Tables.Courses, data => {
            if (!data) {
                andThen([])
            } else {
                let rcourses = <Course[]>data!.filter(v => v != null)
                andThen(rcourses.map(course => {return {name: course.courseNum, id: course.id}}))
            }
        })
    }

}