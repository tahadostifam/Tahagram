import configs from "@/assets/javascript/configs";
import Cookies from "js-cookie";

window.initSocket = () => {
  const refresh_token = Cookies.get("refresh_token");
  const auth_token = Cookies.get("auth_token");
  const username = Cookies.get("username");

  if (refresh_token && auth_token && username) {
    const socket = new WebSocket(configs.socket_address, null, { headers: {} });

    socket.onmessage = (event) => {
      let parsedData;
      try {
        parsedData = JSON.parse(event.data);
      } catch {
        return console.error("Error in parsing socket response data!");
      }
      if (parsedData) {
        if (parsedData.message == "successfully connected to socket") {
          window.ws = socket;
          console.log("Successfully connected to WebSocket server");
        } else {
          if (window.vm) {
            window.handleSocketMessages(window.vm, parsedData);
          } else {
            console.log("an error occured on the server side!");
          }
        }
      }
    };

    socket.onclose = function (e) {
      console.log("Socket is closed. Reconnect will be attempted in 1 second.");
      setTimeout(function () {
        initSocket();
      }, 1000);
    };

    socket.onerror = function (err) {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      socket.close();
    };
  }
};

window.handleSocketMessages = (vm, parsedData) => {
  if (parsedData.event == "search_in_chats") {
    vm.$set(vm.$data, "search_chat_result", parsedData.data);
  }
  if (parsedData.message == "full_name updated" && parsedData.full_name) {
    vm.$store.commit("auth/setFullName", parsedData.full_name);
  }
};

window.onload = () => {
  window.handleSplashScreen();
};

window.lazyImage = (e) => {
  e.classList.add("image__loaded");
};

window.handleSplashScreen = () => {
  const splash = document.querySelector("#full_splash_screen");
  splash.style.opacity = 0;
  setTimeout(() => {
    splash.style.display = "none";
  }, 200);
};

window.dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
