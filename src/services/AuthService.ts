
import {Request} from "express";
import {User} from "../schema/user";

export interface AuthData {
    signedIn: boolean
    user?: User
}

export class AuthService {
    static parse(raw: any): AuthData {
        let no = {
            signedIn: false
        }

        if (raw.hasOwnProperty("signedIn")) {
            let signedIn = raw.signedIn
            if (signedIn) {
                if (raw.hasOwnProperty("user")) {
                    let userData: object = raw.user
                    let userObj = User.parse(userData)

                    if (userObj) {
                        return {
                            signedIn: true,
                            user: <User>userObj
                        }
                    }
                }
            }
        }

        return no
    }

    static extract(req: Request): AuthData {
        if (req.signedCookies && req.signedCookies.authData) {
            return AuthService.parse(req.signedCookies.authData);
        }

        return {
            signedIn: false
        }
    }

    static validate(auth: AuthData): boolean {
        return auth.signedIn
    }
}