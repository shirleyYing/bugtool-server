const readline = require("readline");
const fs = require("fs");
// const path = require("path");

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(`${fileName}`),
    });
    const errorLog = [];
    let errorContent = "";
    let contentStart = false;
    let isError = false;
    rl.on("line", line => {
      const timeRegx = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\]/g;
      const regx1 = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\]\s\[ERROR\]/g;
      const isStart = timeRegx.test(line);
      if (isStart) {
        isError = regx1.test(line);
      }
      // 一行新log
      if (isStart && errorContent) {
        contentStart = false;
        errorLog.push(errorContent);
        // console.log('errorLog',errorLog);
        errorContent = "";
      }
      if (isStart && isError) {
        contentStart = true;
        // console.log("contentStart", contentStart);
      }
      if (contentStart) {
        errorContent += line;
      }
    });
    rl.on("close", function () {
      if (errorContent) {
        errorLog.push(errorContent);
      }
      return resolve(errorLog);
    });
  });
}

function Bugtransfer(fileName, errorType) {
  const logDir = global.__LOGDIR__;
  return readFile(`${logDir}/${fileName}`)
    .then(arr => {
      if (arr.length === 0) {
        console.log("目前未发现错误日志");
        return [];
      }
      // const stream = fs.createWriteStream("../error.txt", { flags: "w" });
      // // 优化点：倒叙写
      // stream.write(`=======================从最新的错误开始解析:=======================\n`);
      const resultList = [];
      let patternList = [];
      if (["all", "unknownError"].includes(errorType)) {
        Object.keys(global.__PATTERN__).forEach(key => {
          patternList = patternList.concat(global.__PATTERN__[key]);
        });
      } else {
        patternList = global.__PATTERN__[errorType] || [];
      }
      arr.reverse().forEach(function (item, index) {
        let obj = {};
        const { time, type, errorPath, errorTranslateMsg, errorColor, errorTypeLabel, errorSuggestion, fileName, lineNum } = handleErroMsg(
          item,
          patternList
        );
        const str = item.replace(/\s{4}/g, "\n");
        // let content = `=======================ERROR Log解析${index}:=======================\n`;

        if (errorPath) {
          // content += `路由错误路径：${errorPath}\n`;
          obj.routePath = errorPath;
        }

        if (type) {
          obj.type = type;
          // content += `错误类型：${type}\n`;
        }

        if (errorTranslateMsg) {
          obj.translateLog = errorTranslateMsg;
          // content += `错误解析：${errorTranslateMsg}\n`;
        }
        obj.time = time;
        obj.color = errorColor;
        obj.fileName = fileName;
        obj.suggestion = errorSuggestion;
        obj.lineNum = lineNum;
        obj.typeLabel = errorTypeLabel;
        obj.originLog = `${str}\n\n`;
        if (errorType === "all") {
          resultList.push(obj);
        } else if (type === errorType) {
          resultList.push(obj);
        }
        // content += `原始错误日志：${str}\n\n`;
        // stream.write(content);
      });
      // console.log("result", resultList);
      // stream.end();
      return resultList;
    })
    .catch(err => {
      console.error("err", err);
    });
}
/**
 *
 * @param {*} item 错误日志
 * @param {*} errorType 指定的错误类型
 */
function handleErroMsg(item, patternList) {
  let errorColor = "";
  let errorTypeLabel = "";
  let errorSuggestion = ""; //对应处理建议
  let type = "unknownError"; // 错误类型：分系统未知错误，sql错误，es错误，joi校验错误,未知错误
  let errorPath = ""; // 错误接口路径
  let errorTranslateMsg = ""; // 翻译后的错误信息

  const message = item.replace(/[^\w-_\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/]at\s.*$/g, "");
  let fileName = "";
  let lineNum = "";
  let errorMessageArr = [];
  let errorArr = message.match(/(default|error)\s-\s(\[(\w+\/\w+\.\w+)\:(\d+)\]){0,1}\s?(.*)/);
  // errorArr = message.match(/(default|error)\s-\s\[(\w+\/\w+\.\w+)\:(\d+)\]\s?(.*)/);
  if (errorArr && errorArr.length === 6) {
    errorMessageArr = errorArr[5].match(/([\S]*)[(e|E)(rror|RROR):]?(.*)/) || [];
    fileName = errorArr[3] || '';
    lineNum = errorArr[4] || '';
  }

  // console.log("errorArr::", errorArr)
  // console.log("errorMessageArr:::", errorMessageArr)
  // if (!errorArr) {
  //   errorArr = message.match(/(default|error)\s-\s(.*)/);
  // }
  // if (errorArr.length === 5) {
  //   errorMessageArr = errorArr[4].match(/([\S]*)[(e|E)(rror|RROR):]?(.*)/);
  //   fileName = errorArr[2];
  //   lineNum = errorArr[3];
  // } else {
  //   errorMessageArr = errorArr[2].match(/([\S]*)[(e|E)(rror|RROR):]?(.*)/);
  // }
  const timeRegx = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\]/g;
  if (errorMessageArr.length === 3) {
    const routerPrefixReg = new RegExp(global.__ROUTER_PREFIX__);
    if (routerPrefixReg.test(errorMessageArr[1])) {
      // 匹配路由
      const rReg = new RegExp(`${global.__ROUTER_PREFIX__}\(\[^:\\s\]*\)`);
      errorPath = errorMessageArr[1].match(rReg)[1];
    }
    for (let i = 0; i < patternList.length; i++) {
      const { lineRegxPattern, type: itemType, label, suggestion, color, typeLabel } = patternList[i];
      const regx = new RegExp(lineRegxPattern);
      const field = errorMessageArr[2].match(regx);

      if (field && label) {
        errorTranslateMsg = label.replace(/\*/g, field[1]);
        type = itemType;
        errorColor = color;
        errorTypeLabel = typeLabel;
        errorSuggestion = suggestion;
        break;
      }
    }
  }
  const timeMatch = item.match(timeRegx);
  let timeStr = "";
  if (timeMatch.length > 0) {
    timeStr = timeMatch[0].slice(1, timeMatch[0].length - 1);
  }
  if (type === 'unknownError') {
    // 没有检查到任何error的错误信息
    const result = errorMessageArr[2] ? errorMessageArr[2].match(/(error|Error|ERROR)/) : ''
    if (!result) {
      errorSuggestion = "未检查到任何错误信息，请使用INFO级别打印该信息"
    }
  }


  return {
    time: timeStr,
    errorColor,
    errorTypeLabel,
    type,
    errorPath,
    errorTranslateMsg,
    fileName,
    lineNum,
    errorSuggestion,
  };
}

module.exports = Bugtransfer;
