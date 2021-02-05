"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tables = void 0;
var user_1 = require("./user");
var task_1 = require("./task");
var course_1 = require("./course");
var user_settings_1 = require("./user_settings");
var Tables = /** @class */ (function () {
    function Tables() {
    }
    Tables.Users = { key: "users", modelBuilder: user_1.User.parse };
    Tables.Tasks = { key: "tasks", modelBuilder: task_1.Task.parse };
    Tables.Courses = { key: "courses", modelBuilder: course_1.Course.parse };
    Tables.UserSettings = { key: "user_settings", modelBuilder: user_settings_1.UserSettings.parse };
    return Tables;
}());
exports.Tables = Tables;
