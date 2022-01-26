import Cookies from "js-cookie";

export const state = () => ({
  user_logged_in: false,
  auth: {
    username: null,
    refresh_token: null,
    auth_token: null,
  },
  user_info: null,
});

export const mutations = {
  addNewMessage(state, { chat_id, message }) {
    const chat = state.user_info.chats_messages.find(
      ({ _id }) => _id == chat_id
    );
    if (chat) {
      if (chat.messages_list) {
        chat.messages_list.push(message);
      }
    }
  },
  setRefreshToken(state, token) {
    state.auth.refresh_token = token;
  },
  setAuthToken(state, token) {
    state.auth.auth_token = token;
  },
  setUserData(state, data) {
    state.user_info = data;
  },
  setUserLoggedIn(state, b) {
    state.user_logged_in = b;
  },
  setUsername(state, username) {
    state.auth.username = username;
  },
  setChatsList(state, list) {
    state.chats_list = list;
  },
  addProfilePhotos(state, filename) {
    if (filename.trim() != "") {
      state.user_info.profile_photos.splice(0, 0, {
        filename: filename,
      });
    }
  },
  setFullName(state, full_name) {
    state.user_info.full_name = full_name;
  },
  setBio(state, bio) {
    state.user_info.bio = bio;
  },
};

export const actions = {
  Authenticate({ state }) {
    const axios = this.$axios;

    function fetch_user_data(auth_token) {
      return new Promise((resolve, reject) => {
        axios
          .$post("/api/users/auth", {
            username: state.auth.username,
            auth_token: auth_token,
          })
          .then((response) => {
            if (response.message == "success") {
              return resolve(response.data);
            } else reject();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    return new Promise((resolve, reject) => {
      fetch_user_data(state.auth.auth_token)
        .then((user) => {
          return resolve(user);
        })
        .catch(() => {
          console.log("getting new auth_token");
          axios
            .$post("/api/users/refresh_token", {
              refresh_token: state.auth.refresh_token,
            })
            .then((response) => {
              if (response.message == "success") {
                // NOTE - we have new token now :)
                // ANCHOR
                Cookies.set("auth_token", response.tokens.auth_token);
                fetch_user_data(response.tokens.auth_token).then(
                  (new_user) => {
                    console.log("auth_token changed");
                    return resolve(new_user);
                  },
                  (error) => {
                    console.log("1: refreshing auth_token failed");
                    return reject();
                  }
                );
                // ANCHOR
              } else {
                console.log("2: refreshing auth_token failed");
                return reject();
              }
            })
            .catch(() => {
              console.log("3: refreshing auth_token failed");
              return reject();
            });
        });
    });
  },
};
