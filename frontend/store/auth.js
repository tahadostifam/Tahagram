export const state = () => ({
  user_logged_in: false,
  auth: {
    username: null,
    refresh_token: null,
    auth_token: null,
  },
  user_info: null,
  chats_list: null,
});

export const mutations = {
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
};

export const actions = {
  Authenticate({ state }) {
    const axios = this.$axios;

    function fetch_user_data(auth_token) {
      return new Promise((resolve, reject) => {
        axios
          .$post("/users/auth", {
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
            .$post("/users/refresh_token", {
              refresh_token: state.auth.refresh_token,
            })
            .then((response) => {
              if (response.message == "success") {
                // NOTE - we have new token now :)
                // ANCHOR
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
