import mockjs from 'mockjs';

export default {
  'GET /getLogAndTypeList': {
    error_code: 0,
    data: {
      Log: ['2019-01-02.app.log', '2019-01-03.app.log', '2019-01-04.app.log'],
      Type: [
        { Type: 'Sql', Label: 'sql语法错误' },
        { Type: 'Joi', Label: '参数传递错误' },
        { Type: 'InternalError', Label: '系统内部错误' },
        { Type: 'Es', Label: 'es查询错误' }
      ]
    }
  },
  'POST /getLogContent': (req, res) => {
    res.send(
      {
        error_code: 0,
        // data: []
        data: [{
          time: '2019-02-02 10:00:00',
          color: '#000',
          type: 'sql',
          typeLabel: 'sql类型错误',
          originLog: `[2019-09-29T20:01:03.427] [ERROR] error - /cloud-api-new api error: { Error: Duplicate entry '1445149556' for key 'idx_uid'
          at Packet.asError (/soc_web/node_modules/mysql2/lib/packets/packet.js:684:17)
          at Query.execute (/soc_web/node_modules/mysql2/lib/commands/command.js:28:26)
          at Connection.handlePacket (/soc_web/node_modules/mysql2/lib/connection.js:449:32)
          at PacketParser.Connection.packetParser.p [as onPacket] (/soc_web/node_modules/mysql2/lib/connection.js:72:12)
          at PacketParser.executeStart (/soc_web/node_modules/mysql2/lib/packet_parser.js:75:16)
          at Socket.Connection.stream.on.data (/soc_web/node_modules/mysql2/lib/connection.js:79:25)
          at Socket.emit (events.js:182:13)
          at addChunk (_stream_readable.js:283:12)
          at readableAddChunk (_stream_readable.js:264:11)
          at Socket.Readable.push (_stream_readable.js:219:10)
          at TCP.onStreamRead [as onread] (internal/stream_base_commons.js:94:17)  code: 'ER_DUP_ENTRY',  errno: 1062,  sqlState: '23000',  sqlMessage: 'Duplicate entry \'1445149556\' for key \'idx_uid\'' }`, //原始错误日志
          translateLog: "主键'idx_uid'的唯一值重复", //翻译后的log错误文字
          routePath: '/cloud-api-new',// 路由错误路径
          suggestion: '检查写入数据',
          fileName: "routes/report.js",
          lineNum: '82'
        },
        {
          time: '2019-03-02 10:00:00',
          color: 'red',
          type: 'sql',
          typeLabel: 'sql类型错误',
          originLog: `[2019-09-29T20:01:03.427] [ERROR] error - /cloud-api-new api error: { Error: Duplicate entry '1445149556' for key 'idx_uid'
          at Packet.asError (/soc_web/node_modules/mysql2/lib/packets/packet.js:684:17)
          at Query.execute (/soc_web/node_modules/mysql2/lib/commands/command.js:28:26)
          at Connection.handlePacket (/soc_web/node_modules/mysql2/lib/connection.js:449:32)
          at PacketParser.Connection.packetParser.p [as onPacket] (/soc_web/node_modules/mysql2/lib/connection.js:72:12)
          at PacketParser.executeStart (/soc_web/node_modules/mysql2/lib/packet_parser.js:75:16)
          at Socket.Connection.stream.on.data (/soc_web/node_modules/mysql2/lib/connection.js:79:25)
          at Socket.emit (events.js:182:13)
          at addChunk (_stream_readable.js:283:12)
          at readableAddChunk (_stream_readable.js:264:11)
          at Socket.Readable.push (_stream_readable.js:219:10)
          at TCP.onStreamRead [as onread] (internal/stream_base_commons.js:94:17)  code: 'ER_DUP_ENTRY',  errno: 1062,  sqlState: '23000',  sqlMessage: 'Duplicate entry \'1445149556\' for key \'idx_uid\'' }`, //原始错误日志
          translateLog: "主键'idx_uid'的唯一值重复", //翻译后的log错误文字
          routePath: '/cloud-api-new',// 路由错误路径
          suggestion: '检查写入数据',
          fileName: "",
          lineNum: ''
        }]
      }
    );
  },
}
