"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIService = void 0;
var table_1 = require("../schema/table");
var user_1 = require("../schema/user");
var user_settings_1 = require("../schema/user_settings");
var https = require('https');
var http = require('http');
var APIService = /** @class */ (function () {
    function APIService(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    APIService.prototype.getByID = function (id, table, andThen) {
        var ref = this.db.ref(table.key + "/" + id);
        console.log("[APIService] Grabbing entry " + id + " from table " + table.key);
        ref.once("value").then(function (data) {
            var x = data.toJSON();
            console.log("\t[" + table.key + "/" + id + "] Received reply: " + JSON.stringify(x));
            if (x == null) {
                andThen(null);
            }
            else {
                var construct = table.modelBuilder(x);
                if (construct == null) {
                    console.log("\t[" + table.key + "/" + id + "] Model Builder failed to construct object");
                }
                andThen(construct);
            }
        }); //.catch(reason => console.log(`[APIService] Request to database was rejected: ${reason}`))
    };
    APIService.prototype.getByOwner = function (ownerID, table, andThen) {
        this.getByKey('owner', ownerID, table, andThen);
    };
    APIService.prototype.getByKey = function (key, value, table, andThen) {
        var ref = this.db.ref(table.key);
        var query = ref.orderByChild(key).equalTo(value);
        console.log("[APIService] Performing query on table " + table.key + ": " + key + "=" + value);
        query.once("value").then(function (data) {
            var x = data.toJSON();
            console.log("\t[? " + key + "=" + value + "] Received reply: " + JSON.stringify(x));
            if (x == null) {
                andThen(null);
            }
            else {
                var resultList_1 = [];
                Object.entries(x).forEach(function (_a) {
                    var idx = _a[0], value = _a[1];
                    var cons = table.modelBuilder(value);
                    if (cons == null) {
                        console.log("\t[? " + key + "=" + value + "] Model Builder failed to construct reply index " + idx + " (" + JSON.stringify(value) + ")");
                    }
                    resultList_1.push(cons);
                });
                andThen(resultList_1);
            }
        });
    };
    APIService.prototype.update = function (id, value, table, then) {
        var ref = this.db.ref(table.key + "/" + id);
        // console.log(JSON.stringify(value))
        var data = (value.toJSON());
        Object.keys(data).forEach(function (key) {
            if (data[key] === undefined || typeof data[key] === "function") {
                delete data[key];
            }
        });
        console.log("[APIService] Updating data: " + JSON.stringify(data));
        var promise = ref.set(data);
        if (then) {
            promise.then(function () { return then(); });
        }
    };
    APIService.prototype.addEntry = function (entry, table, then) {
        var ref = this.db.ref(table.key);
        var npost = ref.push();
        entry.id = npost.key;
        var data = entry.toJSON();
        Object.keys(data).forEach(function (key) { return data[key] === undefined && delete data[key]; });
        var promise = npost.set(data);
        if (then) {
            promise.then(function () { return then(entry.id); });
        }
    };
    APIService.prototype.deleteEntry = function (id, table, then) {
        var ref = this.db.ref(table.key + "/" + id);
        var promise = ref.set(null);
        if (then) {
            promise.then(function () { return then(); });
        }
    };
    APIService.prototype.getOrCreateAuthUser = function (token, andThen, fail) {
        var _this = this;
        this.auth.verifyIdToken(token).then(function (data) {
            _this.getByKey('token', data.uid, table_1.Tables.Users, function (matches) {
                if (!matches) {
                    _this.createUser(data.uid, andThen, fail);
                }
                else if (matches.length < 1) {
                    _this.createUser(data.uid, andThen, fail);
                }
                else {
                    var match = matches[0];
                    if (!match) {
                        console.log("[APIService] Retrieved bad user data");
                        fail();
                    }
                    andThen(match);
                }
            });
        }, function (bad) { return fail(); });
    };
    APIService.prototype.createUser = function (uid, andThen, fail) {
        var _this = this;
        this.auth.getUser(uid).then(function (record) {
            var user = new user_1.User(uid, record.email, record.displayName || "", "joe", "");
            var settings = new user_settings_1.UserSettings();
            _this.addEntry(settings, table_1.Tables.UserSettings, function (settingsID) {
                user.settingsID = settingsID;
                _this.addEntry(user, table_1.Tables.Users, function (userID) {
                    user.id = userID;
                    andThen(user);
                });
            });
        }, function (bad) { return fail(); });
    };
    APIService.prototype.getCourseLinkData = function (owner, andThen) {
        this.getByOwner(owner, table_1.Tables.Courses, function (data) {
            if (!data) {
                andThen([]);
            }
            else {
                var rcourses = data.filter(function (v) { return v != null; });
                andThen(rcourses.map(function (course) { return { name: course.courseNum, id: course.id }; }));
            }
        });
    };
    return APIService;
}());
exports.APIService = APIService;
