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

    if (scrollSelect)
      this.scrollSelectTop = scrollSelect.getBoundingClientRect().top;

    const selectElement = document.getElementById('select-element');
    if (selectElement)
      this.selectElementHeight = selectElement.getBoundingClientRect().height;
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
    if (items.length > 0) {
      const offset = items[0][0] === '#' ? 64 : 65;
      for (let i = 65; i < 91; i++) {
        const j = i - offset;
        const expectedCharacter = String.fromCharCode(i);
        if (!items[j] || items[j][0] !== expectedCharacter)
          items.splice(j, 0, [expectedCharacter, []]);
      }
    }
    if (this.props.suggestions && this.props.suggestions !== [])
      items.unshift(['\u00A0', this.props.suggestions]);
    return items;
  })();

  handleOnTouchStart = index => {
    let i = index;
    while (
      i < this.formattedItems.length &&
      this.formattedItems[i][1].length === 0
    ) {
      ++i;
    }

    if (i === this.formattedItems.length) {
      i = index;
      while (i > 0 && this.formattedItems[i][1].length === 0) {
        --i;
      }
    }
    const goToGroup = this.formattedItems[i][0];
    const touchedLetter = this.formattedItems[index][0];
    window.location.hash = '#' + goToGroup;
    this.setState({bubbleAt: touchedLetter});
  };

  handleOnTouchMove = event => {
    let index = parseInt(
      (event.touches[0].pageY - this.scrollSelectTop) /
        this.selectElementHeight,
      10
    );
    if (index < 0 || Object.is(index, -0)) index = 0;
    if (index >= this.formattedItems.length)
      index = this.formattedItems.length - 1;
    let letter = this.formattedItems[index][0];
    if (letter === '\u00A0') letter = this.formattedItems[1][0];
    if (letter !== this.state.bubbleAt) {
      this.setState(prevState => ({
        bubbleAt: letter,
        prevLetter: prevState.bubbleAt
      }));
      window.location.hash = '#' + letter;
    }
  };

  handleOnTouchEnd = () => {
    this.setState({bubbleAt: null});
  };

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
            this.formattedItems.map(
              ([group, groupItems]) =>
                groupItems.length > 0 ? (
                  <div key={group} id={group}>
                    <p className="list-selection--list-text list-selection--list-text--group-header">
                      {group !== '\u00A0' ? group.toUpperCase() : 'Suggestions'}
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
                ) : (
                  <div key={group} />
                )
            )}
        </div>

        <div className="list-selection--scroll-select" id="scroll-select">
          {this.formattedItems.map(([group], index) => (
            <div
              key={group}
              className="list-selection--scroll-select-element"
              id="select-element"
              onTouchStart={() => this.handleOnTouchStart(index)}
              onTouchMove={this.handleOnTouchMove}
              onTouchEnd={this.handleOnTouchEnd}>
              {this.state.bubbleAt === group && (
                <div className="list-selection--bubble">
                  <Bubble letter={group} />
                </div>
              )}
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
  ).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object)
};

export default ListSelection;
