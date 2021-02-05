"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var manager = require("./route_manager");
var home = require("./pages/home");
var board = require("./pages/board");
var list = require("./pages/list");
var courseDetail = require("./pages/course_detail");
var routes = [{ method: manager.GET, route: '/', handler: home },
    { method: manager.GET, route: '/board', handler: board },
    { method: manager.GET, route: '/list', handler: list },
    { method: manager.GET, route: '/course-detail', handler: courseDetail }];
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
