import React, {Component} from 'react';
import './ErrorPage.css';
import cross from './cross.svg';
import PropTypes from 'prop-types';

class ErrorPage extends Component {
  componentDidMount() {
    this.props.clearErrors();
  }

  restart = () => {
    this.props.history.replace('/');
  };

  render() {
    return (
      <div className="error-page page" onClick={this.restart}>
        <p className="error-page--text--main">Oops! Something went wrong...</p>
        <p className="error-page--text--sub ">
          Can you try that again, please?
        </p>
        <img className="error-page--cross" src={cross} alt="" />
      </div>
    );
  }
}
ErrorPage.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  history: PropTypes.shape({replace: PropTypes.func.isRequired}).isRequired
};

export default ErrorPage;
