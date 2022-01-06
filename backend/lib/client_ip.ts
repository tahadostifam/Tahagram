import { Request, Response } from "express";

export function clientIp(req: Request, res: Response) {
    let client_ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (client_ip) {
        client_ip = client_ip.replace(/^.*:/, "");
        return client_ip;
    } else {
        res.statusCode = 503;
        res.send({
            message: "bad request because client ip not found",
        });
    }
}

export function cleanIpDots(ip: string) {
    return ip.replace(/\./g, "");
}
