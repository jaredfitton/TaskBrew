"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var Task = /** @class */ (function () {
    function Task(owner, title, stage, type, description, link, dueDate, course, complexity, colOrder) {
        this.owner = owner;
        this.title = title;
        this.stage = stage;
        this.type = type;
        this.description = description;
        this.link = link;
        this.dueDate = dueDate;
        this.course = course;
        this.complexity = complexity;
        this.colOrder = colOrder;
        this.id = "";
    }
    Task.parse = function (raw) {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("owner")
            && raw.hasOwnProperty("title")
            && raw.hasOwnProperty("stage")
            && raw.hasOwnProperty("type")
            && raw.hasOwnProperty("description")
            && raw.hasOwnProperty("dueDate")
            && raw.hasOwnProperty("complexity")
            && raw.hasOwnProperty("colOrder")) {
            var tem = raw;
            tem.dueDate = new Date(tem.dueDate);
            return tem;
        }
        console.log("[Task] Data was rejected as it was missing required keys");
        console.log("\thas key 'id': " + raw.hasOwnProperty('id'));
        console.log("\thas key 'owner': " + raw.hasOwnProperty('owner'));
        console.log("\thas key 'title': " + raw.hasOwnProperty('title'));
        console.log("\thas key 'stage': " + raw.hasOwnProperty('stage'));
        console.log("\thas key 'type': " + raw.hasOwnProperty('type'));
        console.log("\thas key 'description': " + raw.hasOwnProperty('description'));
        console.log("\thas key 'dueDate': " + raw.hasOwnProperty('dueDate'));
        console.log("\thas key 'complexity': " + raw.hasOwnProperty('complexity'));
        console.log("\thas key 'colOrder': " + raw.hasOwnProperty('colOrder'));
        return null;
    };
    Task.prototype.toJSON = function () {
        var out = this;
        if (this.dueDate.getTime) {
            out['dueDate'] = this.dueDate.getTime();
        }
        return out;
    };
    return Task;
}());
exports.Task = Task;
