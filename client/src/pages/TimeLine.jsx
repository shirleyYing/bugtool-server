import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Icon, Timeline } from 'antd';
import TimeLineItem from '../components/TimeLineItem';
import styles from './Timeline.less';

export default ({ data = [] }) => {
  const [viewOperate, setViewOperate] = useState({});
  const [dateObj, setDateObj] = useState({});

  useEffect(() => {
    data.forEach(item => {
      item.date = moment(item.time).format('YYYY-MM-DD');
    })
    const obj = _.groupBy(data, 'date');
    setDateObj(obj);

    const view = _.cloneDeep(viewOperate);
    Object.keys(obj).forEach(time => {
      if (!view[time]) {
        view[time] = 'unfold';
      }
    });
    if (!_.isEqual(view, viewOperate)) {
      setViewOperate(view);
    }
  }, [data, viewOperate])

  const foldToggle = idx => {
    const foldFlag = viewOperate[idx] === 'fold';
    const newViewObj = Object.assign({}, viewOperate, {
      [idx]: foldFlag ? 'unfold' : 'fold',
    });
    setViewOperate(newViewObj);
  };

  const getFoldToolTip = (list) => {
    const obj = _.groupBy(list, 'typeLabel');
    const arr = []
    Object.keys(obj).forEach(type => {
      arr.push(`${obj[type].length}个${type}`)
    })
    return `包含${arr.join('、')}`;
  }

  return <div className={styles.timeLine}>
    <Timeline>
      {Object.keys(dateObj).map(date => {
        return (
          <Timeline.Item key={date}>
            <div style={{ marginLeft: '20px' }}>
              <div className={styles.dateWrap}>
                <span>{date}</span>
                <span
                  className={styles.foldIcon}
                  onClick={() => foldToggle(date)}
                  style={{
                    color: '#979797',
                    marginRight: '10px',
                    marginTop: '3px',
                  }}
                >
                  {viewOperate[date] === 'fold' ? <Icon title="展开" type="down" /> : <Icon title="收起" type="up" />}
                </span>
              </div>

              {viewOperate[date] !== 'fold' &&
                dateObj[date].map((secItem, idx) => (
                  <TimeLineItem
                    key={idx}
                    record={secItem}
                  />
                ))}

              {viewOperate[date] === 'fold' && (
                <div className={styles.foldTooltipWrap}>{getFoldToolTip(dateObj[date])}</div>
              )}
            </div>
          </Timeline.Item>
        );
      })}
    </Timeline>
  </div>
}
