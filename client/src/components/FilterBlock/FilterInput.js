import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const FilterInput = ({
  type,
  labelWidth,
  defaultValue,
  contentStyle,
  placeholder,
  filterOnChange,
}) => {
  const [current, setCurrent] = useState(defaultValue);

  const setFilterOnChange = value => {
    setCurrent(value);
    filterOnChange(type, value);
  };

  return (
    <Input
      style={{ width: 250 - labelWidth, ...contentStyle }}
      onChange={evt => setFilterOnChange(evt.target.value)}
      value={current}
      placeholder={placeholder}
    />
  );
};

FilterInput.defaultProps = {
  type: '',
  defaultValue: '',
  labelWidth: 40,
  contentStyle: {},
  placeholder: '',
  filterOnChange: () => { },
};

FilterInput.propTypes = {
  type: PropTypes.string,
  labelWidth: PropTypes.number,
  defaultValue: PropTypes.string,
  contentStyle: PropTypes.object,
  placeholder: PropTypes.string,
  filterOnChange: PropTypes.func,
};

export default FilterInput;
