export const state = () => ({
    user_logged_in: false,
    auth: {
        refresh_token: null,
        auth_token: null,
    },
    user_info: null
})