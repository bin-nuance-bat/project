import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import tick from './tick.svg';
import PropTypes from 'prop-types';
import Bubble from './Bubble';

class ListSelection extends Component {
  state = {
    prevLetter: null,
    bubbleAt: null
  };

  componentDidMount() {
    const scrollSelect = document.getElementById('scroll-select');
    const header = document.getElementsByTagName('header')[0];
    scrollSelect.addEventListener('touchmove', this.preventDefault, false);
    header.addEventListener('touchmove', this.preventDefault, false);

    if (scrollSelect)
      this.scrollSelectTop = scrollSelect.getBoundingClientRect().top;

    const selectElement = document.getElementsByClassName('group');
    if (selectElement.length > 0)
      this.selectElementHeight = selectElement[0].getBoundingClientRect().height;
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
    // If we have suggestions in the list, increment the index to skip them
    if (this.formattedItems[0][0] === '\u00A0') index++;

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

    // If we have suggestions in the list, increment the index to skip them
    if (this.formattedItems[0][0] === '\u00A0') index++;

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
    const header = document.getElementsByTagName('header');
    scrollSelect.removeEventListener('touchmove', this.preventDefault, false);
    header[0].removeEventListener('touchmove', this.preventDefault, false);
  }

  render() {
    return (
      <div className="list-container">
        <ol>
          {this.props.items.length > 0 &&
            this.formattedItems.map(
              ([group, groupItems]) =>
                groupItems.length > 0 ? (
                  <li key={group} id={group} className="list-group">
                    <h2>
                      {group !== '\u00A0' ? group.toUpperCase() : 'Suggestions'}
                    </h2>
                    <hr />
                    <ul>
                      {groupItems.map(item => (
                        <li
                          className="list-item"
                          key={item.id}
                          data-test={item.id}
                          onClick={() => this.props.onClick(item)}>
                          <img
                            className="icon"
                            src={
                              item.name === this.props.selected
                                ? tick
                                : item.image
                            }
                            alt=""
                          />
                          <p
                            className={
                              item.name === this.props.selected
                                ? 'selected'
                                : ''
                            }>
                            {item.name}
                            {item.qualifier && (
                              <span className="qualifier">
                                {item.qualifier}
                              </span>
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <div key={group} />
                )
            )}
        </ol>

        <div className="group-select" id="scroll-select">
          {this.formattedItems
            .filter(([group]) => group !== '\u00A0')
            .map(([group], index) => (
              <div
                key={group}
                className="group"
                onTouchStart={() => this.handleOnTouchStart(index)}
                onTouchMove={this.handleOnTouchMove}
                onTouchEnd={this.handleOnTouchEnd}>
                {this.state.bubbleAt === group && (
                  <div className="bubble">
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
  suggestions: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.string
};

export default ListSelection;
