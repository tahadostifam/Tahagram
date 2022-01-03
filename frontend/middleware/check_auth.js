export default function({store, redirect}) {
    if (!store.state.auth.user_logged_in || !store.state.auth.auth.refresh_token == null || !store.state.auth.auth.token || !store.state.auth.auth.user_info) {
        return redirect('/signin')
    }
    else{
        return redirect('/chat')
    }
}