const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    open: true,
    host: "localhost",
    port: 8080,
    https: false,
    //以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: {
      //配置跨域
      [process.env.VUE_APP_BASE_API]: {
        target: "https://localhost:5001/api/", //这里后台的地址模拟的;应该填写你们真实的后台接口
        ws: true,
        changOrigin: true, //允许跨域
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "", //请求的时候使用这个api就可以
        },
      },
    },
  },
  chainWebpack: (config) => {
    const oneOfsMap = config.module.rule("scss").oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          // 要公用的scss的路径
          resources: "src/styles/_variables.scss",
        })
        .end();
    });

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  configureWebpack: {
    module: {
      rules: [
        {
          include: /node_modules/,
          test: /\.mjs$/,
          type: "javascript/auto",
        },
      ],
    },
  },
};
