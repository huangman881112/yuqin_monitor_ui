const config = require('./config')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost',
    port: 8080,//本地运行的端口
    open: true, //配置自动启动浏览器 
    //接口代理
    proxy: {
      // 不使用前端直接访问es，不然接口难以鉴权
      // '/es': {
      //   target: 'http://127.0.0.1:9200',//设置要代理访问的接口---这是es的接口
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/es': ''//重写访问地址，在请求时可以省略target的地址，直接以/news开头
      //   }
      // },
      '/api': {
        target: config[process.env.NODE_ENV].baseUrl,//设置要代理访问的接口----这是后端服务的接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  //重写访问地址，在请求时可以省略target的地址，直接以/api开头
        }
      }
    }
  }
})
