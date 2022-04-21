import configs from '../configs/configs';

const ConfigsPlugin = (_context, inject) => {
  inject('configs', {
    theme_color: configs.theme_color,
  });
};

export default ConfigsPlugin;