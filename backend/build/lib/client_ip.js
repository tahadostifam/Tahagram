"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanIpDots = exports.clientIp = void 0;
function clientIp(req, res) {
    let client_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (client_ip) {
        client_ip = client_ip.replace(/^.*:/, "");
        return client_ip;
    }
    else {
        res.statusCode = 503;
        res.send({
            message: "bad request because client ip not found",
        });
    }
}
exports.clientIp = clientIp;
function cleanIpDots(ip) {
    return ip.replace(/\./g, "");
}
exports.cleanIpDots = cleanIpDots;
