// 系统内置的匹配规则
module.exports = {
  sql: {
    color: "#5cdbd3",
    type: "sql",
    typeLabel: "sql语法错误",
    patternList: [
      {
        lineRegxPattern: /Table\s\'(.*)\'\sdoesn\'t\sexist/,
        label: "引用不存在的SQL表*",
        suggestion: "查看数据库该表结构是否存在，或检查表名是否拼写错误",
      },
      {
        lineRegxPattern: /Unknown\scolumn\s\'(.*)\'\sin/,
        label: "引用SQL表中不存在的列*",
        suggestion: "查看表结构该字段是否存在，或检查表名是否拼写错误",
      },
      {
        lineRegxPattern: /You\shave\san\serror\sin\syour\sSQL\ssyntax;[^\']*\'(.*)\'/,
        label: "SQL查询语法错误,请检查在*附近的语法",
        suggestion: "检查sql语法是否拼写正确",
      },
      {
        lineRegxPattern: /Column\s(\S*)\sin\sfield\slist\sis\sambiguous/,
        label: "列*在字段列表中重复。多表联查时，相同字段若不加表名，将导致指代不明",
        suggestion: "检查sql语法是否拼写正确",
      },
      {
        lineRegxPattern: /Duplicate\sentry\s.*\sfor\skey\s(\S*)/,
        label: "主键*的唯一值重复",
        suggestion: "检查写入数据",
      },
    ],
  },
  es: {
    color: "#722ed1",
    type: "es",
    typeLabel: "es查询错误",
    patternList: [
      {
        lineRegxPattern: /\[illegal_argument_exception\] Fielddata is disabled on text fields by default.*\[(.*)\]/,
        label: "聚类类型非法：*字段为text类型，不可使用text类型字段进行聚类，可更改为keyword类型",
        suggestion: "将该字段mapping改为keword类型，或使用 `field.keyword` 进行检索",
      },
      {
        lineRegxPattern: /\[query_shard_exception\] No mapping found for.*\[(.*)\]/,
        label: "搜索字段*不存在",
        suggestion: "检查es mapping 该字段是否存在，或是否存在拼写错误",
      },
      {
        lineRegxPattern: /\[index_not_found_exception\] no such index.*index=(\S*)/,
        label: "*索引不存在",
        suggestion: "创建该索引",
      },
      {
        lineRegxPattern: /\[status_exception\]\spressure\stoo\shigh\,\srest\scomposite\sindices\srequest\scircuit\sbreak/,
        label:
          "腾讯云的ES在内核层面内置了异常熔断的功能。当集群jvm堆内存old区占比比较高的时候，为了保证集群的稳定性，会梯度的拒绝一部分请求",
        suggestion: "扩大服务器内存",
      },
    ],
  },
  joi: {
    color: "#ffa940",
    type: "joi",
    typeLabel: "参数校验错误",
    patternList: [
      {
        lineRegxPattern: /child\s\"([a-zA-Z\d]*)\"\sfails/,
        label: "参数*校验错误",
        suggestion: "检查所提交参数",
      },
    ],
  },
  internalError: {
    color: "#f5222d",
    type: "internalError",
    typeLabel: "系统内部错误",
    patternList: [
      {
        lineRegxPattern: /(\S*)\sis\snot\sa\sfunction/,
        label: "引用未定义函数*",
        suggestion: "检查变量是否为null，或者在调用then时确保是否返回了一个promise",
      },
      {
        lineRegxPattern: /(\S*)\sis\snot\sdefined/,
        label: "引用未定义变量*",
        suggestion: "检查引用变量是否存在",
      },
      {
        lineRegxPattern: /Cannot\sconvert\sundefined\sor\snull\sto\sobject/,
        label: "错误将未定义或null的变量转化为对象",
        suggestion: "检查变量类型是否为对象，若该变量是其他函数返回结果，检查其他函数是否执行正常",
      },
      {
        lineRegxPattern: /Cannot\sread\sproperty\s'0'\sof\sundefined/,
        label: "错误读取undefined变量的第一个元素",
        suggestion: "连续链式调用时，确保每个链式调用的值都存在。建议使用 && ，例如：resp && resp.hits && resp.hits.hits &&resp.hits.hits[0]；或者为每个变量赋默认初值，例如：const res = hits || []",
      },
      {
        lineRegxPattern: /Assignment\sto\sconstant\svariable/,
        label: "错误改变常量变量的取值",
        suggestion: "将变量定义 `const`改为`let`",
      },
      {
        lineRegxPattern: /Cannot\sread\sproperty\s(\S*)\sof\sundefined/,
        label: "错误读取undefined变量的*属性",
        suggestion:
          "连续链式调用时，确保每个链式调用的值都存在。建议使用 && ，例如 resp && resp.aggregations && resp.aggregations.test；或者为每个变量赋默认初值，例如：const res = aggregations || {}",
      },
      {
        lineRegxPattern: /Cannot\sread\sproperty\s(\S*)\sof\snull/,
        label: "错误读取null变量的*属性",
        suggestion: "连续链式调用时，确保每个链式调用的值都存在。建议使用 && ，例如 resp && resp.aggregations && resp.aggregations.test；或者为每个变量赋默认初值，例如：const res = aggregations || {}",
      },
      {
        lineRegxPattern: /Unexpected\stoken\s(\S*)\sin\sJSON/,
        label: 'JSON格式错误，存在错误字符"*"',
        suggestion: "执行 JSON.parse()方法时报错，检查string是否为标准的JSON 字符串",
      },
      {
        lineRegxPattern: /Unexpected\stoken\s(\S*)/,
        label: '存在错误字符"*"',
        suggestion: "检查是否存在语法或拼写错误",
      },
      {
        lineRegxPattern: /connect\sECONNREFUSED\s(\S*)/,
        label: "连接异常，请检查*端口是否被占用",
        suggestion: "使用`lsof -i:port` 检查端口占用情况，杀掉占用该端口的进程",
      },
      {
        lineRegxPattern: /Request\sTimeout/,
        label: "请求超时",
        suggestion: "检查与目标地址网络是否通畅",
      },
      {
        lineRegxPattern: /socket\shang\sup/,
        label: "接口请求异常",
        suggestion: "检查网络是否通畅以及检测后端服务是否启动正常",
      },
    ],
  },
};
