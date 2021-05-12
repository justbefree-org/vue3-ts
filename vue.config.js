/*
 * @Author: Just be free
 * @Date:   2021-05-11 11:15:10
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-05-11 11:15:18
 * @E-mail: justbefree@126.com
 */
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "node_modules/awesome-scss-bem/src/bem.scss";@import "@/theme/global.scss";`,
      },
    },
  },
  devServer: {
    proxy: {
      "/api": {
        target: "https://yesno.wtf",
        changeOrigin: true,
      },
    },
  },
};
