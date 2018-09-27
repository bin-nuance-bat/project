import {Component} from 'react';
import PropTypes from 'prop-types';

class Scrollable extends Component {
  componentDidMount() {
    document.body.style.position = 'static';
  }

  componentWillUnmount() {
    document.body.style.position = 'fixed';
  }

  render() {
    return this.props.children;
  }
}

Scrollable.propTypes = {
  children: PropTypes.element.isRequired
};

export default Scrollable;
