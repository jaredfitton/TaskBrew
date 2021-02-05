import { Router } from "express";
import { Request, Response } from "express";
import {APIService} from "../services/APIService";

exports.GET = 'get';
exports.POST = 'post';
exports.PUT = 'put';

export interface RouteNode {
    resolve: (request: Request, response: Response, api: APIService) => void
}

export interface RouteData {
    method : string,
    route : string,
    handler : RouteNode
}

/**
 *
 * @param {[RouteData]} routes
 * @param {Router} router
 * @param {APIService} api
 */
function attachRoutes(routes: RouteData[], router: Router, api: APIService) {
    for (const rid in routes) {
        if (routes.hasOwnProperty(rid)) {
            let route = routes[rid];
            if (route.method === exports.GET) {
                router.get(route.route, function (req, res) {
                    route.handler.resolve(req, res, api);
                })
            } else if (route.method === exports.POST) {
                router.post(route.route, function (req, res) {
                    route.handler.resolve(req, res, api);
                })
            } else if (route.method === exports.PUT) {
                router.put(route.route, function (req, res) {
                    route.handler.resolve(req, res, api);
                })
            }
        }
    }
}

exports.attachRoutes = attachRoutes;


