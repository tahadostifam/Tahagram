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
};

export const actions = {
  async Authenticate({ commit, state }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post("/users/auth", {
          username: state.auth.username,
          auth_token: state.auth.auth_token,
        })
        .then((response) => {
          if (response.message == "success") {
            return resolve(response.data);
          } else reject();
        })
        .catch((error) => {
          reject();
        });
    });
  },
};
