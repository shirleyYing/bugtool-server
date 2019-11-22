const pattern = {
  logDir: `logs`,
  // fileName: 'app.*',
  // routerMatchPrefix: 'Router->/',
  routerMatchPrefix: '/',
  rules: {
    sql: {
      color: "green",
      type: "sql",
      typeLabel: 'sql语法错误',
      patternList: [{
        lineRegxPattern: /Table\s\'(.*)\'\sdoesn\'t\sexist/,
        label: "引用不存在的SQL表*",
      }]
    },
    client:{
      color: "blue",
      type: "client",
      typeLabel: '前端上报错误',
      patternList: [{
        lineRegxPattern: /errorMessage/, 
        label: "*不存在",
      }]
    }
  },
};
module.exports = pattern;
