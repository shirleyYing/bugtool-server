import React, { useReducer, useEffect, useState } from 'react';
import styles from './index.css';
import { Empty } from 'antd';
import FilterBlock from '@/components/FilterBlock';
import TimeLine from './TimeLine';
import InfiniteScroll from '@/components/InfiniteScroll';
import { getLogAndTypeList, getLogContent } from '../services/WebApi';

const reducer = (state, action) => {
  return { ...state, ...action.payload }
}

const initFilterList = [
  {
    type: 'select',
    name: '日志',
    key: 'Log',
    list: [],
  },
  {
    type: 'select',
    name: '错误类型',
    key: 'Type',
    defaultValue: 'all',
    list: [
      { name: '全部', value: 'all' },
    ],
  },
];

export default function () {

  const [query, dispatch] = useReducer(reducer, {
    Log: '',
    Type: 'all'
  })
  const [filterList, setFilterList] = useState(initFilterList);
  const [data, setData] = useState([]);

  const submitFilter = async () => {
    if (query.Log && query.Type) {
      const ret = await getLogContent(query);
      setData(ret);
    }
  }

  useEffect(() => {
    async function fetchInitData() {
      const ret = await getLogAndTypeList();
      ret.Log.sort((a, b) => a > b ? -1 : 1); //降序排序
      // console.log("ret:::", ret);
      const fstLog = ret.Log[0];
      if (fstLog) {
        initFilterList[0].list = ret.Log.map(log => ({ name: log, value: log }));
        initFilterList[0].defaultValue = fstLog;
        initFilterList[1].list = initFilterList[1].list.concat(ret.Type.map(item => ({ name: item.Label, value: item.Type })));
        const initQuery = { Log: fstLog, Type: 'all' };
        dispatch({ payload: initQuery });
        setFilterList(initFilterList);
        const rsp = await getLogContent(initQuery);
        setData(rsp);
      }
    }

    fetchInitData();
  }, [])

  // console.log("data:::", data);

  const filterOnChange = (type, value) => {
    console.log("type:::", type, "value:::", value);
    const item = filterList.filter(obj => obj.key === type);
    item[0].defaultValue = value;
    dispatch({ payload: { [type]: value } });
  }


  return (
    <div>
      <div className={styles.pjHeader}>
        <span style={{ position: 'absolute', left: '24px' }}>LogAnalyze</span>
        <div
          style={{
            fontSize: '14px',
            lineHeight: '30px',
            paddingTop: '20px',
            marginLeft: '40px',
          }}
        >
          <FilterBlock
            filterList={filterList}
            filterOnChange={filterOnChange}
            submitFilter={submitFilter}
          />
        </div>
      </div>
      <div className={styles.content}>
        {
          data.length > 0 ?
            <InfiniteScroll data={data}>
              <TimeLine />
            </InfiniteScroll> :
            // <TimeLine data={data} /> :
            <Empty style={{ position: 'absolute', width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无错误日志" />
        }
      </div>
    </div>

  );
}
