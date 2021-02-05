"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = 'get';
exports.POST = 'post';
exports.PUT = 'put';
/**
 *
 * @param {[RouteData]} routes
 * @param {Router} router
 * @param {APIService} api
 */
function attachRoutes(routes, router, api) {
    var _loop_1 = function (rid) {
        if (routes.hasOwnProperty(rid)) {
            var route_1 = routes[rid];
            if (route_1.method === exports.GET) {
                router.get(route_1.route, function (req, res) {
                    route_1.handler.resolve(req, res, api);
                });
            }
            else if (route_1.method === exports.POST) {
                router.post(route_1.route, function (req, res) {
                    route_1.handler.resolve(req, res, api);
                });
            }
            else if (route_1.method === exports.PUT) {
                router.put(route_1.route, function (req, res) {
                    route_1.handler.resolve(req, res, api);
                });
            }
        }
    };
    for (var rid in routes) {
        _loop_1(rid);
    }
}
exports.attachRoutes = attachRoutes;
