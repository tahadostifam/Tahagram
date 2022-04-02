import configs from "../assets/javascript/configs"

export default ({ app }, inject) => {
    inject('configs', {
        theme_color: configs.theme_color
    })
}