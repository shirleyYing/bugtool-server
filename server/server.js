const fs = require("fs");
const { promisify } = require("util");
const Koa = require("koa");
const koaCompress = require("koa-compress");
const koaStatic = require("koa-static");
const koaRouter = require("@koa/router");
const koaBody = require("koa-body");
const prepare = require("./prepare");
const apiRoter = require("./routes/api");
async function run(ip, port, dir, fileName) {
  return await prepare(dir, fileName)
    .then(() => {
      const app = new Koa();
      app.use(
        koaCompress({
          threshold: 2048
        })
      );
      app.use(
        koaStatic(`${__dirname}/dist`, {
          maxAge: 2 * 24 * 60 * 60 * 1000,
          gzip: true
        })
      );
      app.use(
        koaBody({
          multipart: true,
          formidable: {
            hash: "md5",
            maxFileSize: 10 * 1024 * 1024 * 1024
          }
        })
      );
      app.use(apiRoter.routes());
      const cacheIndex = null;
      const browserRouter = koaRouter();
      browserRouter.get("*", async ctx => {
        if (cacheIndex) {
          ctx.type = "html";
          ctx.body = cacheIndex;
          return;
        }

        try {
          ctx.type = "html"; // 指定content type
          ctx.body = await promisify(fs.readFile)(
            `${__dirname}/dist/index.html`,
            "utf-8"
          );
        } catch (e) {
          console.log();
          ctx.status = 404;
          ctx.body = "Not Found: /dist/index.html";
        }
      });
      app.use(browserRouter.routes());

      app.host = ip;
      app.port = port;
      app.on("error", err => {
        console.error("server error", err.message, err.stack);
      });

      app.listen(app.port, app.host, () => {
        console.info("server listening on http://%s:%d", app.host, app.port);
        console.info("访问 http://%s:%d 查看错误日志", app.host, app.port);
      });
      return app;
    })
    .catch(err => {
      console.log("err", err);
      console.error("server error", err);
    });
}

module.exports = { run };
