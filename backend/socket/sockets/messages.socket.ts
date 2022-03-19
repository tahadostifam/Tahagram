import auth_socket_user from "../../middlewares/auth_socket_user";

export default function MessagesSocket(app: any) {
    app.ws("/messages", auth_socket_user, (ws: any, req: any) => {
        ws.on("message", (msg: any) => {
            console.log("msg", msg);
        });
    });
}
