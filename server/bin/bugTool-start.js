#!/usr/bin/env node
const path = require("path");
const colors = require("colors");
const program = require("commander");
const wds = require("../server");

program.option("-i, --ip <ip>", "启动ip");
program.option("-p, --port <port>", "启动端口");
program.option("-d, --dir <dir>", "读取log目录");
program.option("-f, --fileName <fileName>", "指定文件名，支持正则");

program.parse(process.argv);

async function run() {
  try {
    let { ip = "0.0.0.0", port = 10240 } = program;
    await wds.run(ip, port);
  } catch (err) {
    console.error(colors.grey(err.stack));
    console.error("❗️ " + colors.red(err.message));
    process.exit(1);
  }
}

run();
