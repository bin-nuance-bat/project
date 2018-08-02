import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './line.svg';
import PropTypes from 'prop-types';
import Bubble from './Bubble';

class ListSelection extends Component {
  state = {
    prevLetter: null,
    bubbleAt: null
  };

  componentDidMount() {
    const scrollSelect = document.getElementById('scroll-select');
    const header = document.getElementById('header');
    scrollSelect.addEventListener('touchmove', this.preventDefault, false);
    header.addEventListener('touchmove', this.preventDefault, false);
    this.scrollSelectTop = document
      .getElementById('scroll-select')
      .getBoundingClientRect().top;
    this.selectElementHeight = document
      .getElementById('select-element')
      .getBoundingClientRect().height;
  }

  startsWithLetter = str => {
    return str.match(/^[a-z]/i);
  };

  preventDefault = e => {
    e.preventDefault();
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

  componentWillUnmount() {
    const scrollSelect = document.getElementById('scroll-select');
    const header = document.getElementById('header');
    scrollSelect.removeEventListener('touchmove', this.preventDefault, false);
    header.removeEventListener('touchmove', this.preventDefault, false);
  }

  render() {
    return (
      <div className="list-selection--body">
        <div className="list-selection--list">
          {this.props.items.length > 0 &&
            this.formattedItems.map(([group, groupItems]) => (
              <div key={group} id={group}>
                <p className="list-selection--list-text list-selection--list-text--group-header">
                  {group.toUpperCase()}
                </p>
                <img
                  src={line}
                  className="list-selection--group-splitter"
                  alt=""
                />
                {groupItems.map(item => (
                  <div
                    className={
                      'list-selection--list-item ' +
                      this.props.iconStyle +
                      '-holder'
                    }
                    key={item.id}
                    data-test={item.id}
                    onClick={() => this.props.onClick(item)}>
                    <img
                      className={
                        'list-selection--item-icon ' + this.props.iconStyle
                      }
                      src={item.image}
                      alt=""
                    />
                    <p className="list-selection--list-text list-selection--list-text--item-name">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div className="list-selection--scroll-select" id="scroll-select">
          {this.formattedItems.map(([group]) => (
            <div key={group}>
              <div
                className="list-selection--scroll-select-element"
                id="select-element"
                onTouchStart={() => {
                  window.location.hash = '#' + group;
                  this.setState({bubbleAt: group});
                }}
                onTouchMove={event => {
                  let index = parseInt(
                    (event.touches[0].pageY - this.scrollSelectTop) /
                      this.selectElementHeight,
                    10
                  );
                  if (index < 0 || Object.is(index, -0)) index = 0;
                  if (index >= this.formattedItems.length)
                    index = this.formattedItems.length - 1;
                  const letter = this.formattedItems[index][0];
                  if (letter !== this.state.bubbleAt) {
                    this.setState(prevState => ({
                      bubbleAt: letter,
                      prevLetter: prevState.bubbleAt
                    }));
                    window.location.hash = '#' + letter;
                  }
                }}
                onTouchEnd={() => {
                  this.setState({bubbleAt: null});
                }}>
                {this.state.bubbleAt === group && (
                  <div className="list-selection--bubble">
                    <Bubble letter={group} />
                  </div>
                )}
                {group}
              </div>
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
