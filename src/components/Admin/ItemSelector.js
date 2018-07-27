import React from 'react';
import PropTypes from 'prop-types';

const ItemSelector = props => {
  return (
    <select
      value={props.item}
      disabled={props.disabled}
      onChange={e => props.setItem(e.target.value)}>
      {props.items.map(item => (
        <option key={item.id} value={item.id}>
          {item.name + (item.qualifier ? ` (${item.qualifier})` : '')}
        </option>
      ))}
    </select>
  );
};

ItemSelector.propTypes = {
  item: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      qualifier: PropTypes.string
    })
  ),
  setItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ItemSelector;
