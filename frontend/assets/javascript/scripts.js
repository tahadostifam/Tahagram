import configs from "@/assets/javascript/configs";
import Cookies from "js-cookie";

window.initSocket = () => {
  const refresh_token = Cookies.get("refresh_token");
  const auth_token = Cookies.get("auth_token");
  const username = Cookies.get("username");

  if (refresh_token && auth_token && username) {
    const socket = new WebSocket(configs.socket_address, null, { headers: {} });

    socket.onopen = () => {
      vm.$set(vm.$data, "show_internet_bar", false);
    };

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
      vm.$set(vm.$data, "show_internet_bar", true);
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
  } else if (
    parsedData.message == "full_name updated" &&
    parsedData.full_name
  ) {
    vm.$store.commit("auth/setFullName", parsedData.full_name);
  } else if (parsedData.message == "bio updated" && parsedData.bio) {
    vm.$store.commit("auth/setBio", parsedData.bio);
  } else if (parsedData.message == "bio updated" && parsedData.bio) {
    vm.$store.commit("auth/setBio", parsedData.bio);
  } else if (parsedData.event == "you_have_new_message") {
    we_have_new_message(vm, parsedData);
  } else if (parsedData.event == "chat_created_from_a_user") {
    chat_created(vm, parsedData);
  } else if (
    parsedData.message == "message sended" &&
    parsedData.message_callback
  ) {
    message_sended(vm, parsedData);
  } else if (parsedData.message == "message deleted") {
    message_deleted(vm, parsedData);
  } else if (parsedData.event == "get_user_full_info") {
    get_user_full_info(vm, parsedData);
  } else {
    console.log(parsedData);
  }
};

function get_user_full_info(vm, parsedData) {
  vm.$set(vm.$data.active_chat, "username", parsedData.user_info.username);
  vm.$set(vm.$data.active_chat, "full_name", parsedData.user_info.full_name);
  vm.$set(
    vm.$data.active_chat,
    "profile_photos",
    parsedData.user_info.profile_photos
  );
  vm.$set(vm.$data.active_chat, "bio", parsedData.user_info.bio);
}

function chat_created(vm, parsedData) {
  vm.$store.commit("auth/addChat", {
    chat_id: parsedData.__chat_created.chat_id,
    chat_type: parsedData.chat_type,
    full_name: parsedData.__chat_created.full_name,
    username: parsedData.__chat_created.username,
    profile_photo: parsedData.__chat_created.profile_photo,
  });

  vm.$store.commit("auth/createNewChat", {
    _id: parsedData.__chat_created.chat_id,
    chat_type: parsedData.chat_type,
    messages_list: parsedData.__chat_created.messages,
    target_username: parsedData.__chat_created.username,
  });
}

function message_deleted(vm, parsedData) {
  const chats_messages = vm.$store.state.auth.user_info.chats_messages;
  if (chats_messages) {
    const finded_chat_index = chats_messages.findIndex(
      ({ _id }) => _id === parsedData.chat_id
    );
    if (finded_chat_index != null) {
      const message_index = chats_messages[
        finded_chat_index
      ].messages_list.findIndex(
        ({ message_id }) =>
          message_id === vm.$data.message_context_menu_message_id
      );
      if (message_index != null) {
        vm.$store.commit("auth/removeMessage", {
          message_index: message_index,
          chat_index: finded_chat_index,
        });
      }
    }
  }
}

function message_sended(vm, parsedData) {
  const message = Object.assign(parsedData.message_callback, {
    seen_state: "sended",
  });
  if (parsedData.chat_created && parsedData.chat_created.chat_id) {
    const new_chat_id = parsedData.chat_created.chat_id;
    vm.$set(vm.$data.active_chat, "chat_id", new_chat_id);
    vm.$set(vm.$data.active_chat, "chat_type", parsedData.chat_type);
    vm.$set(vm.$data.active_chat, "non_created_chat", false);
    vm.$set(vm.$data.active_chat, "messages", [message]);

    vm.$store.commit("auth/addChat", {
      chat_id: vm.$data.active_chat.chat_id,
      chat_type: vm.$data.active_chat.chat_type,
      full_name: vm.$data.active_chat.full_name,
      username: vm.$data.active_chat.username,
      profile_photo: vm.$data.active_chat.profile_photo,
    });

    vm.$store.commit("auth/createNewChat", {
      _id: new_chat_id,
      chat_type: parsedData.chat_type,
      messages_list: [message],
      target_username: parsedData.target_username,
    });
  } else {
    vm.$store.commit("auth/addNewMessage", {
      message: message,
      chat_id: parsedData.chat_id,
    });
    if (vm.$data.active_chat && vm.$data.active_chat.messages) {
      const chats_messages = vm.$store.state.auth.user_info.chats_messages;
      if (chats_messages) {
        const find_result = chats_messages.find(
          ({ _id }) => _id === parsedData.chat_id
        );
        if (find_result) {
          vm.$set(vm.$data.active_chat, "messages", find_result.messages_list);
        }
      }
    } else {
      vm.$set(vm.$data.active_chat, "messages", [message]);
    }
  }
}

function we_have_new_message(vm, parsedData) {
  if (vm.$store.state.auth.chats_list) {
    const chat_id = parsedData.chat_id;
    const chats_messages = vm.$store.state.auth.user_info.chats_messages;
    const chat_exists = vm.$store.state.auth.chats_list.find(
      ({ chat_id }) => chat_id === chat_id
    );

    if (!chat_exists) {
      vm.$store.commit("auth/addChat", {
        chat_id: chat_id,
        chat_type: parsedData.new_chat.chat_type,
        full_name: parsedData.new_chat.full_name,
        username: parsedData.new_chat.username,
        profile_photo: parsedData.new_chat.profile_photo,
      });
    }

    const chat_messages = chats_messages.find(({ _id }) => _id === chat_id);
    if (chat_messages) {
      // we should add the message into chats_messages state
      vm.$store.commit("auth/addNewMessage", {
        message: parsedData.message,
        chat_id: parsedData.chat_id,
      });
      if (vm.$data.active_chat && vm.$data.active_chat.messages) {
        if (chats_messages) {
          const find_result = chats_messages.find(
            ({ _id }) => _id === parsedData.chat_id
          );
          if (find_result) {
            // TODO - Notifications
            if (vm.$data.active_chat.chat_id == parsedData.chat_id) {
              vm.$set(
                vm.$data.active_chat,
                "messages",
                find_result.messages_list
              );
            }
          }
        }
      } else {
        // TODO - Notifications
        if (vm.$data.active_chat.chat_id == parsedData.chat_id) {
          vm.$set(vm.$data.active_chat, "messages", [parsedData.message]);
        }
      }
    } else {
      // NOTE
      // let chat_id;
      // if (parsedData.new_chat._id) chat_type == parsedData.new_chat._id;
      // else parsedData.new_chat.chat_id;
      // vm.$store.commit("auth/createNewChat", {
      //   _id: chat_id,
      //   chat_type: parsedData.chat_type,
      //   messages_list: [parsedData.message],
      //   target_username: parsedData.target_username,
      // });
    }
  }
}

window.initilizing_socket_again = () => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      console.error("socket is empty!");
      await window.initSocket();
      resolve();
    }, 1000);
  });
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
