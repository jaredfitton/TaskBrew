"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.Weekdays = void 0;
var Weekdays = /** @class */ (function () {
    function Weekdays() {
    }
    Weekdays.SUNDAY = { name: 'Sunday', abbrv: 'Sun.' };
    Weekdays.MONDAY = { name: 'Monday', abbrv: 'Mon.' };
    Weekdays.TUESDAY = { name: 'Tuesday', abbrv: 'Tue.' };
    Weekdays.WEDNESDAY = { name: 'Wednesday', abbrv: 'Wed.' };
    Weekdays.THURSDAY = { name: 'Thursday', abbrv: 'Thur.' };
    Weekdays.FRIDAY = { name: 'Friday', abbrv: 'Fri.' };
    Weekdays.SATURDAY = { name: 'Saturday', abbrv: 'Sat.' };
    return Weekdays;
}());
exports.Weekdays = Weekdays;
function cvtMeetingEvent(idx, event) {
    return {
        type: event.type,
        days: event.days,
        meetingLink: event.meetingLink,
        location: event.location,
        idx: idx
    };
}
var Course = /** @class */ (function () {
    function Course(owner, title, courseNum, color, resources, meetings, professor) {
        this.owner = owner;
        this.title = title;
        this.courseNum = courseNum;
        this.color = color;
        this.resources = resources;
        this.meetings = meetings;
        this.professor = professor;
        this.id = "";
    }
    Course.parse = function (raw) {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("owner")
            && raw.hasOwnProperty("title")
            && raw.hasOwnProperty("courseNum")
            && raw.hasOwnProperty("color")) {
            var ro = raw;
            if (!ro.hasOwnProperty("meetings")) {
                ro['meetings'] = {};
            }
            if (!ro.hasOwnProperty("resources")) {
                ro['resources'] = {};
            }
            var tem = ro;
            var resources_1 = [];
            Object.entries(tem.resources).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                return resources_1.push(value);
            });
            var meetings_1 = [];
            Object.entries(tem.meetings).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                return meetings_1.push(value);
            });
            var out = new Course(tem.owner, tem.title, tem.courseNum, tem.color, resources_1, meetings_1.map(function (v, i, a) { return cvtMeetingEvent(i, v); }), tem.professor);
            out.id = tem.id;
            return out;
        }
        console.log("[Course] Data was rejected as it was missing required keys");
        console.log("\thas key 'id': " + raw.hasOwnProperty('id'));
        console.log("\thas key 'owner': " + raw.hasOwnProperty('owner'));
        console.log("\thas key 'title': " + raw.hasOwnProperty('title'));
        console.log("\thas key 'courseNum': " + raw.hasOwnProperty('courseNum'));
        console.log("\thas key 'resources': " + raw.hasOwnProperty('resources'));
        console.log("\thas key 'meetings': " + raw.hasOwnProperty('meetings'));
        console.log("\thas key 'color': " + raw.hasOwnProperty('color'));
        return null;
    };
    Course.prototype.toJSON = function () {
        this.meetings.forEach(function (meet) {
            if (!meet.meetingLink) {
                delete meet['meetingLink'];
            }
            if (!meet.location) {
                delete meet['location'];
            }
        });
        return this;
    };
    return Course;
}());
exports.Course = Course;
