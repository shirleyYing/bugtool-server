import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import FilterSelect from './FilterSelect';
import FilterInput from './FilterInput';
import TimeRangePicker from '@/components/TimeRangePicker';
import styles from './index.less';


const MapComponents = {
  select: FilterSelect,
  input: FilterInput,
  timeRange: TimeRangePicker,
};

const FilterBlock = ({ labelWidth, filterList, filterOnChange, submitFilter }) => (
  <div className={styles.filterBlock}>
    <div className={styles.leftContent}>
      {filterList.map(item => {
        if (!MapComponents[item.type]) {
          throw new Error('component type unsupport, type is Enum("select", "input", "timeRange")');
        }
        const baseProps = {
          key: item.type,
          type: item.key,
          defaultValue: item.defaultValue,
          filterOnChange,
          options: item.list,
        };
        if (item.type === 'timeRange') {
          baseProps.timePickerOnchange = value => {
            filterOnChange(item.key, value);
          };
          baseProps.customOptions = item.list;
          baseProps.timeRange = item.defaultValue;
          // TimeRangePicker units
          if (item.units) {
            baseProps.units = item.units;
          }
          baseProps.contentStyle = {
            width: 250 - labelWidth,
          };
        }
        if (item.type === 'input') {
          baseProps.placeholder = item.placeholder || '';
        }
        return (
          <div key={`${item.type}${item.name}`} className={styles.col}>
            <div style={{ minWidth: labelWidth }}>
              <span style={{ lineHeight: '26px', color: '#7D7D7D ' }}>{item.name}：</span>
            </div>
            <div>
              {React.createElement(MapComponents[item.type], {
                ...baseProps,
              })}
            </div>
          </div>
        );
      })}
    </div>
    <Button type="primary" onClick={submitFilter} className={styles.smallBlueBtn}>
      搜索
    </Button>
  </div>
);

FilterBlock.defaultProps = {
  filterList: [],
  filterOnChange: () => { },
  submitFilter: () => { },
  labelWidth: 40,
};

FilterBlock.propTypes = {
  filterList: PropTypes.array,
  filterOnChange: PropTypes.func,
  submitFilter: PropTypes.func,
  labelWidth: PropTypes.number,
};

export default FilterBlock;
