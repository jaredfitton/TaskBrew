"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettings = void 0;
var UserSettings = /** @class */ (function () {
    function UserSettings() {
        this.id = "";
        this.stages = [{ id: "0", name: "To-Do", color: "#ffff00", locked: true, order: 0 },
            { id: "1", name: "Done", color: "#00FF00", locked: true, order: 1 }];
    }
    UserSettings.parse = function (raw) {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("stages")) {
            var tem = raw;
            var stages_1 = [];
            Object.entries(tem.stages).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                return stages_1.push(value);
            });
            var out = new UserSettings();
            out.stages = stages_1;
            out.id = tem.id;
            return out;
        }
        return null;
    };
    UserSettings.prototype.toJSON = function () {
        return this;
    };
    return UserSettings;
}());
exports.UserSettings = UserSettings;
