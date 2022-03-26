class WSHandler {
    ws = null;
    constructor(url, path, token, callback, handle_socket_messages, onclose) {
        const final_address = `${url}${path}?Authorization=${token}`;
        const _ws = new WebSocket(final_address);
        _ws.onmessage = (e) => {
            try {
                const parsed_data = JSON.parse(e.data);
                if (parsed_data.type == "error") {
                    return callback({
                        type: "error",
                        message: "Unauthorized",
                    });
                } else {
                    handle_socket_messages(parsed_data);
                }
            } catch (error) {
                console.log(e.data);
                console.error(error);
                callback({
                    type: "error",
                    message: "Error in parsing received data",
                });
            }
        };
        _ws.onclose = () => {
            onclose();
            this.closeConnection();
        };

        this.ws = _ws;
        return this;
    }

    closeConnection() {
        this.ws.close();
    }
}

new Vue({
    el: "#app",
    data() {
        return {
            addr_input: "ws://127.0.0.1:8000",
            token_input:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhaGFkIiwiaWF0IjoxNjQ3NzEwNzE1LCJleHAiOjE2NDg1NzQ3MTV9.gntjauZvU7DPZEmOwutGepu8XTiT9lDVsbFiGTJAi0I",
            send_text_input: "",
            logs: [],
            messages: [
                // {
                //     message_type: "text",
                //     content: "hello world",
                //     send_time: "00:00",
                //     sender: "Taha",
                // },
                // {
                //     message_type: "photo",
                //     src: "https://picsum.photos/500/500",
                //     send_time: "00:00",
                //     sender: "Taha",
                // },
            ],
            wsRoot: null,
            wsMessages: null,
            wsOnlineState: null,
        };
    },
    methods: {
        connect() {
            const addr = this.$data.addr_input.trim();
            const token = this.$data.token_input.trim();
            if (addr.length > 0) {
                this.$data.wsRoot = new WSHandler(
                    addr,
                    "/",
                    token,
                    (callback_data) => {
                        if (callback_data.type == "error") {
                            this.$data.wsRoot.closeConnection();
                            this.$data.wsRoot = null;
                            this.$data.logs.push({
                                type: "error",
                                message: callback_data.message,
                            });
                        } else {
                            this.$data.logs.push({
                                message: callback_data.message,
                            });
                        }
                    },
                    (msg) => {
                        console.log(msg);
                        this.$data.logs.append({
                            message: msg,
                        });
                    },
                    () => {
                        this.$data.wsRoot = null;
                    }
                );
                this.$data.wsMessages = new WSHandler(
                    addr,
                    "/messages",
                    token,
                    (callback_data) => {
                        if (callback_data.type == "error") {
                            this.$data.wsMessages.closeConnection();
                            this.$data.wsMessages = null;
                            this.$data.logs.push({
                                type: "error",
                                message: callback_data.message,
                            });
                        } else {
                            this.$data.logs.push({
                                message: callback_data.message,
                            });
                        }
                    },
                    (msg) => {
                        this.$data.logs.append({
                            message: msg,
                        });
                    },
                    () => {
                        this.$data.wsMessages = null;
                    }
                );
            }
        },
        clear_logs() {
            this.$data.logs = [];
        },
        close() {
            if (this.$data.wsRoot) {
                this.$data.wsRoot.closeConnection();
            }
            this.$set(this.$data, "send_text_input", "");
            this.$set(this.$data, "logs", []);
            this.$set(this.$data, "messages", []);
        },
        send_text() {
            const wsRoot = this.$data.wsRoot.ws;
            if (wsRoot) {
                wsRoot.send(this.$data.send_text_input);
            } else {
                this.$data.logs.push({
                    type: "error",
                    message: "wsRoot not found",
                });
            }
        },
    },
});
