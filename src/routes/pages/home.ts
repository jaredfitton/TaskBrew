import {APIService} from "../../services/APIService";
import { Request, Response } from "express";
import {AuthService} from "../../services/AuthService";
import {User} from "../../schema/user";

function resolve(request: Request, response: Response, api: APIService) {
    console.log("[/] Home page requested")
    let authData = AuthService.extract(request);
    console.log("[/] Request cookies: " + JSON.stringify(request.signedCookies))

    if (authData.signedIn) {
        response.redirect('/board')
        return
    }

    let pageVars = {
        page: {
            title: "Welcome",
            key: "splash"
        },
        user: {
            loggedIn: authData.signedIn,
            avatar: authData.user?.avatarKey
        }
    }

    // let user = new User("jterxkcyvubiou", "jatnerd@gmail.com", "Jake", "latte", "0001")
    // user.id = "0001"
    // let cookie = {signedIn: true, user: user}
    // let cookieOptions = {secure: process.env.NODE_ENV==='production', signed: true}
    //
    // response
    //     .cookie('authData', cookie, cookieOptions)
    //     .render('splash', pageVars);

    response.render('home', pageVars)
}

exports.resolve = resolve;