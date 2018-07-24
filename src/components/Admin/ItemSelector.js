import React from 'react';

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

export default ItemSelector;
