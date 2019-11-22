import React from 'react';
import moment from 'moment';
import { Collapse } from 'antd';
import styles from './index.less';

const { Panel } = Collapse;
export default ({
  record
}) => {

  const timeTxt = moment(record.time).format('YYYY-MM-DD HH:mm:ss');

  return (<div
    className={styles.sourceWrap}
    style={{
      borderLeft: `2px solid ${record.color}`,
    }}
  >
    <div className={styles.headerWrap}>
      <span className={styles.title}>{record.translateLog || record.originLog.split('\n')[0]}</span>
      <span
        style={{
          color: record.color,
          // backgroundColor: typeMap[data.Ftype].bgColor,
          padding: '0 8px',
          borderRadius: '5px',
        }}
      >
        {record.typeLabel || '未知错误'}
      </span>
    </div>
    <div className={styles.sourceDetail}>
      <span>{timeTxt.split(' ')[1]}</span>
      <span>
        <span>路由：</span>
        <span>{record.routePath || '未知'}</span>
      </span>
      <span style={{ border: 'none' }}>
        <span>日志打印位置：</span>
        {!record.fileName && !record.lineNum && <span>未知</span>}
        {record.fileName && <span><span className={styles.route}>{record.fileName}</span>文件的</span>}
        {record.lineNum && <span><span className={styles.route}>{record.lineNum}</span>行</span>}
      </span>
      <div className={styles.suggestion}>
        <span>修复建议：</span>
        <span>{record.suggestion}</span>
      </div>
    </div>
    <div className={styles.remarkWrap}>
      <Collapse>
        <Panel header="查看原始日志" key="1">
          <pre>{record.originLog}</pre>
        </Panel>
      </Collapse>
    </div>
  </div>)
}
