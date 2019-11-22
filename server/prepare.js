/* eslint-disable no-nested-ternary */
/* eslint-disable new-cap */
/* eslint-disable prefer-destructuring */
/* eslint-disable global-require */
/**
 * 启动服务前准备工作
 */
const importFresh = require("import-fresh");
const internalPattern = require("./config/internalPattern");
const cloneDeep = require("lodash.clonedeep");
const uniqBy = require("lodash.uniqBy")
/**
 * 启动任务管理
 */
module.exports = async (dir, fileName) => {
  /**
   * global.__ENV__: 环境变量
   */
  global.__ENV__ = "prod";
  if (process.env.ENV === "dev") {
    global.__ENV__ = "dev";
  } else if (process.env.ENV === "test") {
    global.__ENV__ = "test";
  }

  /**
   * global.__ROOTPATH__: 项目根目录
   */
  global.__ROOTPATH__ = __dirname;

  // 根据用户配置文件初始化内容
  const cwd = process.cwd();
  let pattern;
  try {
    pattern = importFresh(`${cwd}/pattern.js`);
  } catch (error) {
    console.log("未找到自定义配置，将使用默认配置");
    pattern = importFresh(`./pattern.js`);
  }
  const ruleObj = pattern.rules || {};
  let patternObj = cloneDeep(internalPattern);
  let errorTypeList = [];

  Object.keys(ruleObj).forEach(type => {
    const { patternList } = ruleObj[type];
    if (internalPattern[type]) {
      // 如果配置的error类型与系统内置相同，则合并并去重
      if (patternList && Array.isArray(patternList)) {
        const arr = patternList.concat(internalPattern[type].patternList);
        patternObj[type].patternList = uniqBy(arr, "lineRegxPattern");
      }
      ["color", "type", "typeLabel"].forEach(key => {
        if (ruleObj[type][key]) {
          patternObj[type][key] = ruleObj[type][key];
        }
      });
    } else {
      patternObj[type] = ruleObj[type];
    }
  });

  const patternTypeObj = {};
  Object.keys(patternObj).forEach(type => {
    const typeObj = patternObj[type];
    if (typeObj.type && typeObj.typeLabel) {
      errorTypeList.push({ Type: typeObj.type, Label: typeObj.typeLabel });
      const list = typeObj.patternList || [];
      patternTypeObj[type] =
        list && Array.isArray(list)
          ? list.map(item => ({
              color: typeObj.color,
              type: typeObj.type,
              typeLabel: typeObj.typeLabel,
              ...item
            }))
          : [];
    }
  });

  errorTypeList.push({ Type: "unknownError", Label: "未知错误" });
  global.__CWD__ = cwd;
  // log读取目录，优先级 命令行指定--配置文件指定--默认值，
  const customDir = dir || pattern.logDir || "logs";
  // fileName 同customDir
  const customFileName = fileName || pattern.fileName || "*log*";
  let logDir = `${global.__CWD__}/${customDir}`;

  // 判断绝对路径
  if (/^\//.test(pattern.logDir)) {
    logDir = pattern.logDir;
  }
  global.__LOGDIR__ = logDir;
  global.__FILENAME__ = customFileName;
  global.__PATTERN__ = patternTypeObj;
  global.__ERRORTYPE__ = errorTypeList;
  global.__ROUTER_PREFIX__ = pattern.routerMatchPrefix || "/";
  console.log("log读取目录", global.__LOGDIR__);
  console.log("log读取文件名", global.global.__FILENAME__);
};
