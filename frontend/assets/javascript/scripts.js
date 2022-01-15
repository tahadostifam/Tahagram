import configs from "@/assets/javascript/configs";

function initSocket() {
  const socket = new WebSocket(configs.socket_address, null, { headers: {} });
  socket.addEventListener("message", function (event) {
    if (event.data == "successfully connected to socket") {
      window.ws = socket;
      console.log("Successfully connected to WebSocket server");
    } else {
      console.log(event.data);
    }
  });
}

window.handleSocketMessages = (vm) => {
  console.log(vm);
};

window.onload = () => {
  window.handleSplashScreen();
  initSocket();
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
