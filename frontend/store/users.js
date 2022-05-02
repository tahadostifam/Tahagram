export const state = () => ({
    authToken: null,
    userData: null,
})

export const mutations = {
    setAuthToken(state, {newAuthToken}) {
        state.authToken = newAuthToken;
    },
    setUserData(state, newUserData) {
        state.userData = newUserData;
    }
}