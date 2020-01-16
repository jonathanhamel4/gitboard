import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { toast } from 'react-semantic-toasts';

import getFetch from '../utils/fetch';

const AsyncDropdown = ({
  source, defaultText, fetchData, onChangeCb, value, keyProp, valueProp, textProp, disabled, errorMessage,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleError(err, msg) {
    if (err) {
      toast({
        type: 'error', icon: 'warning circle', title: 'Error', description: msg, animation: 'bounce', time: 5000,
      });
      console.log(err);
      return true;
    }
    return false;
  }

  async function getData() {
    const { data, err } = await getFetch(source);
    if (handleError(err, errorMessage)) {
      setMenuItems([]);
      return;
    }

    const mappedData = data.map((o) => ({ key: o[keyProp], text: o[textProp], value: o[valueProp] }));
    setMenuItems(mappedData);
  }

  useEffect(() => {
    if (fetchData) {
      setIsLoading(true);
      getData();
      setIsLoading(false);
    } else {
      setMenuItems([]);
    }
  }, [fetchData]);

  return (
    <Dropdown
      disabled={disabled}
      clearable
      placeholder={defaultText}
      selection
      options={menuItems}
      loading={isLoading}
      onChange={(e, val) => onChangeCb(val.value)}
      value={value}
    />
  );
};

AsyncDropdown.propTypes = {
  source: PropTypes.string.isRequired,
  defaultText: PropTypes.string.isRequired,
  fetchData: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChangeCb: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  keyProp: PropTypes.string.isRequired,
  valueProp: PropTypes.string.isRequired,
  textProp: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
};

AsyncDropdown.defaultProps = {
  fetchData: false,
  disabled: false,
  errorMessage: '',
  value: null
};

export default AsyncDropdown;
