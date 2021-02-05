import {Router} from "express";
import {RouteData, RouteNode} from "./route_manager"

let express = require('express');
let manager = require("./route_manager");
import {APIService} from "../services/APIService";

let taskData = require("./providers/task_data")
let formData = require("./providers/form_data")

let routes : RouteData[] = [{method: manager.GET, route: '/task-data', handler: taskData},
    {method: manager.GET, route: '/form-data', handler: formData}];

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
