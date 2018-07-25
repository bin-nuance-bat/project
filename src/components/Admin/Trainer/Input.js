import React from 'react';
import PropTypes from 'prop-types';

const Input = props => {
  if (!props.hide) {
    let inputProps = {};
    if (props.range) {
      inputProps.min = props.range[0];
      inputProps.max = props.range[1];
    }
    return (
      <div className="formGroup">
        <div>{props.label}:</div>
        <div>
          <input
            type={props.type ? props.type : 'number'}
            value={props.value}
            {...inputProps}
            onChange={e => props.setState(e.target.value)}
          />
        </div>
      </div>
    );
  }
  return null;
};

Input.propTypes = {
  hide: PropTypes.bool,
  range: PropTypes.arrayOf(PropTypes.number),
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  setState: PropTypes.func.isRequired
};

export default Input;
