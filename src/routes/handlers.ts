import {Router} from "express";
import {RouteData, RouteNode} from "./route_manager"

let express = require('express');
let manager = require("./route_manager");
import {APIService} from "../services/APIService";

let logout = require("./handlers/logout");
let signin = require("./handlers/signin")

let createTask = require("./handlers/create_task")
let updateTask = require("./handlers/update_task")
let deleteTask = require("./handlers/delete_task")

let createCourse = require("./handlers/create_course")
let addCourseResource = require("./handlers/add_course_resource")
let addMeetingEvent = require("./handlers/add_meeting_event")

let routes : RouteData[] = [{method: manager.GET, route: '/logout', handler: logout},
    {method: manager.POST, route: '/signin', handler: signin},
    {method: manager.POST, route: '/create-task', handler: createTask},
    {method: manager.POST, route: '/update-task', handler: updateTask},
    {method: manager.POST, route: '/delete-task', handler: deleteTask},
    {method: manager.POST, route: '/create-course', handler: createCourse},
    {method: manager.POST, route: '/add-meeting', handler: addMeetingEvent},
    {method: manager.POST, route: '/add-resource', handler: addCourseResource}];

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
