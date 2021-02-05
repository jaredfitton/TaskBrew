import {Router} from "express";
import {RouteData, RouteNode} from "./route_manager"

let express = require('express');
let manager = require("./route_manager");
import {APIService} from "../services/APIService";

let home = require("./pages/home");
let board = require("./pages/board");
let list = require("./pages/list");
let courseDetail = require("./pages/course_detail");

let routes : RouteData[] = [{method: manager.GET, route: '/', handler: home},
    {method: manager.GET, route: '/board', handler: board},
    {method: manager.GET, route: '/list', handler: list},
    {method: manager.GET, route: '/course-detail', handler: courseDetail}];

/**
 * @param {APIService} api
 * @returns {Router}
 */
function router(api : APIService) {
    let result : Router = express.Router()

    manager.attachRoutes(routes, result, api);

    return result;
}

module.exports = router;
