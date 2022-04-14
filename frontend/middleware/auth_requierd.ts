import { Middleware } from '@nuxt/types';

const AuthRequired: Middleware = ({ app: { i18n }, store, redirect }) => {
  if (
    !store.state.auth.user_logged_in ||
    !store.state.auth.auth.auth_token ||
    !store.state.auth.user_info
  ) {
    return redirect('/' + i18n.locale + '/signin');
  }
};

export default AuthRequired;
