export const state = () => ({
  user_logged_in: false,
  auth: {
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
};
