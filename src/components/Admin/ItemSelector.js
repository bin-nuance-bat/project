import React from 'react';
import PropTypes from 'prop-types';

const ItemSelector = props => {
  return (
    <select
      value={props.item}
      disabled={props.busy}
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
  item: PropTypes.object.isRequired,
  busy: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  setItem: PropTypes.func.isRequired
};

export default ItemSelector;
