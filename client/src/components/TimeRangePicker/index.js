// hooks rewrite
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const format = 'YYYY-MM-DD HH:mm:ss';

const options = [
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
];

const TimeRangePicker = ({
  startTime,
  endTime,
  timeRange,
  timePickerOnchange,
  units,
  customOptions,
  mode,
  contentStyle,
}) => {
  const [timePickerShow, setTimePickerShow] = useState(false);
  const [timeSelect, setTimeSelect] = useState(timeRange);
  const [start, setStartTime] = useState(startTime ? moment(startTime) : moment());
  const [end, setEndTime] = useState(endTime ? moment(endTime) : moment());

  const onSearchTimeRefresh = time => {
    const timeEnd = moment();
    const timeStart = moment().subtract(time, units);
    setStartTime(moment(timeStart.valueOf()));
    setEndTime(moment(timeEnd.valueOf()));
    return [time ? timeStart.valueOf() : '', time ? timeEnd.valueOf() : '', time];
  };

  const filterOnChange = value => {
    if (value === '自定义') {
      setTimePickerShow(true);
    } else {
      setTimeSelect(value);
      timePickerOnchange(onSearchTimeRefresh(value));
    }
  };

  const timePickerChange = moments => {
    setStartTime(moments[0]);
    setEndTime(moments[1]);
  };

  const ontimePiker = (timeStart, timeEnd) => {
    const value = `${timeStart.format(format)} 至 ${timeEnd.format(format)}`;
    setTimeSelect(value);
    timePickerOnchange([timeStart.valueOf(), timeEnd.valueOf(), value]);
    setTimePickerShow(false);
  };

  useEffect(
    () => {
      setTimeSelect(timeRange);
    },
    [timeRange],
  );

  return (
    <div>
      <Select
        style={{ width: '100%', ...contentStyle }}
        defaultValue={timeRange}
        showSearch
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={value => filterOnChange(value)}
        value={timeSelect}
      >
        {customOptions.map(option => (
          <Option key={`${option.value}${option.name}`} value={option.value}>
            {option.name}
          </Option>
        ))}
      </Select>
      {timePickerShow && (
        <div>
          <RangePicker
            disabledDate={current => current > moment().endOf('day')}
            allowClear={false}
            defaultValue={[start, end]}
            showTime={{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
            format={format}
            onChange={timePickerChange}
            onOk={() => ontimePiker(start, end)}
            onOpenChange={status => {
              if (!status) {
                ontimePiker(start, end);
              }
            }}
            open
          />
        </div>
      )}
    </div>
  );
};

TimeRangePicker.defaultProps = {
  startTime: '',
  endTime: '',
  timeRange: 1,
  timePickerOnchange: () => {},
  units: 'days',
  customOptions: options,
  mode: 'antd',
  contentStyle: {},
};

TimeRangePicker.propTypes = {
  startTime: PropTypes.any,
  endTime: PropTypes.any,
  timeRange: PropTypes.any,
  timePickerOnchange: PropTypes.func,
  units: PropTypes.oneOf(['seconds', 'minutes', 'hours', 'days', 'months']),
  customOptions: PropTypes.array,
  mode: PropTypes.string,
  contentStyle: PropTypes.object,
};

export default TimeRangePicker;
