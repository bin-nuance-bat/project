import React from 'react';
import './SuccessPage.css';
import Logo from './../Logo/Logo';
import Hand from './../Hand/Hand';
import PropTypes from 'prop-types';

const goHomeAndClearTimeout = (props, timeout) => {
  console.log('aaaa');
  props.history.replace('/');
  clearTimeout(timeout);
};

const SuccessPage = props => {
  console.log(77);
  const timeout = setTimeout(props.history.replace('/'), 10000);
  return (
    <div className="page" onClick={() => goHomeAndClearTimeout(props, timeout)}>
      <Logo />
      <div className="text text-remindersent">Reminder sent!</div>
      <div className="success-hand">
        <Hand snack={props.storeList[props.actualItem].image} />
      </div>
    </div>
  );
};

SuccessPage.propTypes = {
  history: PropTypes.object.isRequired,
  actualItem: PropTypes.string.isRequired,
  storeList: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default SuccessPage;
