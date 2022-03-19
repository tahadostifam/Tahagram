export default function ({ app: { i18n }, store, redirect }) {
  if (
    !store.state.auth.user_logged_in ||
    !store.state.auth.auth.refresh_token ||
    !store.state.auth.auth.auth_token ||
    !store.state.auth.user_info ||
    !store.state.auth.auth.username
  ) {
    return redirect("/" + i18n.locale + "/signin");
  }
}
