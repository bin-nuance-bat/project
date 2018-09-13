import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import tick from './tick.svg';
import PropTypes from 'prop-types';
import Bubble from './Bubble';

const startsWithLetter = str => {
  return str.match(/^[a-z]/i);
};

class ListSelection extends Component {
  state = {
    prevLetter: null,
    bubbleAt: null,
    formattedItems: []
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

  preventDefault = e => {
    e.preventDefault();
  };

  static getDerivedStateFromProps = props => {
    const items = Object.entries(
      _.groupBy(
        _.sortBy(props.items, 'name'),
        item => (startsWithLetter(item.name) ? item.name[0].toUpperCase() : '#')
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
    if (props.additionalOptions && props.additionalOptions !== [])
      items.unshift(['\u00A0', props.additionalOptions.options]);
    return {formattedItems: items};
  };

  handleOnTouchStart = index => {
    // If we have suggestions in the list, increment the index to skip them
    if (this.state.formattedItems[0][0] === '\u00A0') index++;

    let i = index;

    while (
      i < this.state.formattedItems.length &&
      this.state.formattedItems[i][1].length === 0
    ) {
      ++i;
    }

    if (i === this.state.formattedItems.length) {
      i = index;
      while (i > 0 && this.state.formattedItems[i][1].length === 0) {
        --i;
      }
    }

    const goToGroup = this.state.formattedItems[i][0];
    const touchedLetter = this.state.formattedItems[index][0];
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
    if (this.state.formattedItems[0][0] === '\u00A0') index++;

    if (index < 0 || Object.is(index, -0)) index = 0;
    if (index >= this.state.formattedItems.length)
      index = this.state.formattedItems.length - 1;

    let letter = this.state.formattedItems[index][0];
    if (letter === '\u00A0') letter = this.state.formattedItems[1][0];

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
          {this.props.additionalOptions || this.props.items.length > 0
            ? this.state.formattedItems.map(
                ([group, groupItems]) =>
                  groupItems.length > 0 ? (
                    <li key={group} id={group} className="list-group">
                      <h2>
                        {group !== '\u00A0'
                          ? group.toUpperCase()
                          : this.props.additionalOptions.heading}
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
              )
            : null}
        </ol>

        <div className="group-select" id="scroll-select">
          {this.state.formattedItems
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
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  additionalOptions: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired
  }),
  suggestions: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.string
};

export default ListSelection;
