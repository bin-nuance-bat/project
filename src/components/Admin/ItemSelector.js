import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ItemSelector extends Component {
  state = {
    items: []
  };

  static getDerivedStateFromProps(props) {
    return {
      items: props.items.sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
    };
  }

  render() {
    return (
      <select
        value={this.props.item}
        disabled={this.props.disabled}
        onChange={e => this.props.setItem(e.target.value)}>
        {this.state.items.map(item => (
          <option key={item.id} value={item.id}>
            {item.name} {item.qualifier && `(${item.qualifier})`}
          </option>
        ))}
      </select>
    );
  }
}

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
