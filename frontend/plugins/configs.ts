import {Plugin} from "@nuxt/types"
import configs from "../configs/configs"

const configsPlugin: Plugin = (_context, inject) => {
    inject('configs', {
        theme_color: configs.theme_color
    })
}

export default configsPlugin