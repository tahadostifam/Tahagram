import auth_socket_user from "../../middlewares/auth_socket_user";

export default function OnlineStateSocket(app: any) {
    app.ws("/online_state", auth_socket_user, (ws: any, req: any) => {
        ws.send("Welcome to /online_state");
        ws.on("message", (msg: any) => {
            console.log("msg", msg);
        });
    });
}
