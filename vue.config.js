module.exports = {
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    hot: true,
    public: 'busheezy.ngrok.io',
  },
  publicPath:
    process.env.NODE_ENV === 'production' ? '/mhud-settings-editor/' : '/',
};
