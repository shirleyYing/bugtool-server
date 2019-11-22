const router = require("@koa/router")();
const Bugtransfer = require("../lib/transfer");
const globby = require("globby");
const fs = require("fs");

// 获取log文件名，
router.get("/getLogAndTypeList", async ctx => {
  const pathPattern = [`${global.__LOGDIR__}/${global.__FILENAME__}`];
  const paths = globby.sync(pathPattern);
  const pathList = paths.map(item => {
    return item.split("/").pop();
  });
  ctx.body = {
    error_code: 0,
    data: {
      Log: pathList,
      Type: global.__ERRORTYPE__,
    },
  };
});
// 获取日志翻译内容
router.post("/getLogContent", async ctx => {
  const { Log, Type } = ctx.request.body;
  const result = await Bugtransfer(Log, Type);
  ctx.body = {
    error_code: 0,
    data: result,
  };
});
// 下载翻译文件
router.post("/downLoadFile", async ctx => {
  const { Log, Type } = ctx.request.body;
  const result = await Bugtransfer(Log, Type);
  const tmpPath = `${__dirname}/../tmp/error.txt`;
  const stream = fs.createWriteStream(tmpPath, { flags: "w" });
  result.forEach((item, index) => {
    const { type, rawLog, errorPath, errorTranslateMsg } = item;
    let content = `=======================ERROR Log解析${index}:=======================\n`;
    if (errorPath) {
      content += `路由错误路径：${errorPath}\n`;
    }

    if (type) {
      content += `错误类型：${type}\n`;
    }

    if (errorTranslateMsg) {
      content += `错误解析：${errorTranslateMsg}\n`;
    }
    content += `原始错误日志：${rawLog}\n\n`;
    stream.write(content);
  });
  stream.end();

  const readStream = fs.createReadStream(tmpPath);

  ctx.set("Content-Disposition", `attachment; filename=${path}_translate.txt`);
  ctx.body = readStream;
});
module.exports = router;
