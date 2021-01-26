module.exports = {
  recognizeSelfClosing: true,
  lowerCaseAttributeNames: false,
  plugins: {
    'posthtml-include': {
      root: __dirname,
    },
  },
};
