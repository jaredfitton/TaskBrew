import {APIService} from "../../services/APIService";
import { Request, Response } from "express";
import {AuthService} from "../../services/AuthService";

function resolve(request: Request, response: Response, api: APIService) {
    let data: {token:string, name: string, email:string} = request.body

    if (!data) {
        response.status(400).send("UNAUTHORIZED").end()
        return
    }

    api.getOrCreateAuthUser(data.token, usr => {
        let copts = {secure: process.env.NODE_ENV==='production', signed: true}
        let cookie = {signedIn: true, user: usr}

        response.cookie('authData', cookie, copts).status(200).send().end()
    }, () => {
        response.status(400).send("UNAUTHORIZED").end()
        return
    })
}

exports.resolve = resolve;