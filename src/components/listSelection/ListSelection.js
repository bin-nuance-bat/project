import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './line.svg';
import PropTypes from 'prop-types';

class ListSelection extends Component {
  startsWithLetter = str => {
    return str.match(/^[a-z]/i);
  };

  formattedItems = (() => {
    const items = Object.entries(
      _.groupBy(
        _.sortBy(this.props.items, 'name'),
        item =>
          this.startsWithLetter(item.name) ? item.name[0].toUpperCase() : '#'
      )
    );

    return items;
  })();

  handleClick = event => {
    this.props.onClick(event.target.getAttribute('data-key'));
  };

  render() {
    return (
      <div className="list-selection list-selection--body">
        <div className="list-selection list-selection--list">
          {this.props.items.length > 0 &&
            this.formattedItems.map(([group, groupItems]) => (
              <div key={group} id={group}>
                <p className="list-selection list-selection--list-text list-selection--list-text--group-header">
                  {group.toUpperCase()}
                </p>
                <img
                  src={line}
                  className="list-selection list-selection--group-splitter"
                  alt=""
                />
                {groupItems.map(item => (
                  <div
                    className={
                      'list-selection list-selection--list-item ' +
                      this.props.iconStyle +
                      '-holder'
                    }
                    key={item.id}
                    data-key={item.id}
                    onClick={this.handleClick}>
                    <img
                      className={
                        'list-selection list-selection--item-icon ' +
                        this.props.iconStyle
                      }
                      src={item.image}
                      alt=""
                      data-key={item.id}
                      onClick={this.handleClick}
                    />
                    <p
                      data-key={item.id}
                      className="list-selection list-selection--list-text list-selection--list-text--item-name">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div className="list-selection--scroll-select">
          {this.formattedItems.map(([group]) => (
            <div
              key={group}
              onTouchStart={() => (window.location.hash = '#' + group)}>
              {group}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

ListSelection.propTypes = {
  onClick: PropTypes.func.isRequired,
  iconStyle: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

export default ListSelection;
