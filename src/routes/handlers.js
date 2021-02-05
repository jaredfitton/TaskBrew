"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var manager = require("./route_manager");
var logout = require("./handlers/logout");
var signin = require("./handlers/signin");
var createTask = require("./handlers/create_task");
var updateTask = require("./handlers/update_task");
var deleteTask = require("./handlers/delete_task");
var createCourse = require("./handlers/create_course");
var addCourseResource = require("./handlers/add_course_resource");
var addMeetingEvent = require("./handlers/add_meeting_event");
var routes = [{ method: manager.GET, route: '/logout', handler: logout },
    { method: manager.POST, route: '/signin', handler: signin },
    { method: manager.POST, route: '/create-task', handler: createTask },
    { method: manager.POST, route: '/update-task', handler: updateTask },
    { method: manager.POST, route: '/delete-task', handler: deleteTask },
    { method: manager.POST, route: '/create-course', handler: createCourse },
    { method: manager.POST, route: '/add-meeting', handler: addMeetingEvent },
    { method: manager.POST, route: '/add-resource', handler: addCourseResource }];
/**
 * @param {APIService} api
 * @returns {Router}
 */
function router(api) {
    var result = express.Router();
    manager.attachRoutes(routes, result, api);
    return result;
}
module.exports = router;
