"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(token, email, name, avatarKey, settingsID) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.avatarKey = avatarKey;
        this.id = "";
        this.settingsID = settingsID;
    }
    User.parse = function (raw) {
        if (raw.hasOwnProperty("id")
            && raw.hasOwnProperty("token")
            && raw.hasOwnProperty("email")
            && raw.hasOwnProperty("name")
            && raw.hasOwnProperty("avatarKey")
            && raw.hasOwnProperty("settingsID")) {
            return raw;
        }
        return null;
    };
    User.prototype.toJSON = function () {
        return this;
    };
    return User;
}());
exports.User = User;
