| category   | subtitle   | type     | title            |
| ---------- | ---------- | -------- | ---------------- |
| Components | 时间选择器 | 数据录入 | TimeRankgePicker |

下拉模式的时间选择器，支持自定义时间选项，结合 Ant DateRangePicker 选择

## 何时使用

- 需要时间筛选。
- 提供自定义的下拉选择模式
- 提供默认值

```
options = [
  {
    name: '近24小时',
    value: 1,
  },
  {
    name: '近7天',
    value: 7,
  },
  {
    name: '近30天',
    value: 30,
  },
  {
    name: '自定义',
    value: '自定义',
  },
]
```

## API

### TimeRangePicker

| 参数                               | 说明                            | 类型                                                  | 默认值   |
| ---------------------------------- | ------------------------------- | ----------------------------------------------------- | -------- |
| customOptions                      | 自定义时间区间段                | array                                                 | options  |
| endtime                            | 结束时间                        | moment                                                | moment() |
| mode                               | 控制模式, Ant 或者 Tea 封装     | string                                                | ant      |
| reset (decalare when hook version) | 重置时间控件，恢复默认初始状态  | bool                                                  | false    |
| startTime                          | 开始时间                        | moment                                                | moment() |
| timePickerOnchange                 | 选择时间后回调                  | function(startTime, endTime, value)                   |          |
| timeRange                          | 默认值，对应 options 中的 value | string\|number                                        | 1        |
| units                              | 时间筛选单位                    | enum('seconds', 'minutes', 'hours', 'days', 'months') | days     |

> 注：value 的取值与 units 有关，自定义 customOptions 的选项时，注意 value 的取值
