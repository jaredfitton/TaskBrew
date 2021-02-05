"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var manager = require("./route_manager");
var taskData = require("./providers/task_data");
var formData = require("./providers/form_data");
var routes = [{ method: manager.GET, route: '/task-data', handler: taskData },
    { method: manager.GET, route: '/form-data', handler: formData }];
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
