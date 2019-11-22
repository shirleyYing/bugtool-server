
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' }
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      title: 'client',
      dll: false,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  outputPath: '../server/dist',
  proxy: {
    // '/api': { target: 'http://10.12.90.70/', changeOrigin: true },
    '/getLogAndTypeList': { target: 'http://localhost:10240/', changeOrigin: true },
    '/getLogContent': { target: 'http://localhost:10240/', changeOrigin: true },
  },
}
