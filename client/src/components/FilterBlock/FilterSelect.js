import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const FilterSelect = ({
  type,
  showSearch,
  labelWidth,
  options,
  defaultValue,
  contentStyle,
  filterOnChange,
}) => {
  const [current, setCurrent] = useState(defaultValue);

  const setFilterOnChange = value => {
    setCurrent(value);
    filterOnChange(type, value);
  };

  useEffect(() => {
    if (defaultValue !== current) {
      setCurrent(defaultValue)
    }
  }, [current, defaultValue])


  return (
    <Select
      style={{ width: 250 - labelWidth, ...contentStyle }}
      showSearch={showSearch}
      filterOption={
        showSearch
          ? (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          : null
      }
      onChange={value => setFilterOnChange(value)}
      value={current}
    >
      {options.map(option => (
        <Select.Option key={`${type}${option.name}`} value={option.value}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

FilterSelect.defaultProps = {
  type: '',
  defaultValue: '',
  showSearch: true,
  labelWidth: 40,
  options: [],
  contentStyle: {},
  filterOnChange: () => { },
};

FilterSelect.propTypes = {
  type: PropTypes.string,
  showSearch: PropTypes.bool,
  labelWidth: PropTypes.number,
  options: PropTypes.array,
  defaultValue: PropTypes.string,
  contentStyle: PropTypes.object,
  filterOnChange: PropTypes.func,
};

export default FilterSelect;
