#!/usr/bin/env node
const program = require("commander");
const packageInfo = require("../package.json");

program.version(packageInfo.version);

program.command("start", "启动日志分析服务, 默认监听0.0.0.0的10240端口")
  .usage("start -i <ip> -p <port> -d <logdir> -f <fileName>")
  .on('--help', function () {
    console.log('');
    console.log('Examples:');
    console.log('  $ bugTool start');
    console.log('  $ bugTool start -i 127.0.0.1')
    console.log('  $ bugTool start -p 3000');
    console.log('  $ bugTool start -i 127.0.0.1 -p 3000');
    console.log('  $ bugTool start -i 127.0.0.1 -p 3000 -d logs -f app.log*');
  });

program.parse(process.argv);
// error on unknown commands
const [cmd] = program.args;
if (!program._execs.has(cmd)) {
  console.log("Invalid command: %s\nSee --help for a list of available commands.", program.args.join(" "));
  program.outputHelp();
  process.exit(1);
}
