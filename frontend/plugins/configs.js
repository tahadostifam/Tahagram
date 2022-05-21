import configs from '../configs/configs';

const ConfigsPlugin = (_context, inject) => {
  inject('configs', {
    themeColor: configs.themeColor,
  });
};

export default ConfigsPlugin;