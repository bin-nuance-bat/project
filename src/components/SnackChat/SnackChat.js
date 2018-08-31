import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stage, Provider} from '@inlet/react-pixi';

import FilterView from './FilterView';
import BackButton from '../BackButton/BackButton';

import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';

class SnackChat extends Component {
  state = {
    loading: true,
    rotation: 0
  };

  componentDidMount() {
    this.props.loadStoreList().then(() => {
      this.setState({loading: false});
    });
  }

  render() {
    return (
      <div className="page">
        <header className="header">
          <BackButton handleClick={() => {}} />
          <div className="header-text">SnackChat</div>
        </header>
        <div>
          {!this.state.loading && (
            <Stage>
              <Provider>
                {app => (
                  <FilterView
                    image={
                      this.props.storeList[
                        'ccad58e3-e27a-4463-9139-17a36ff7f7b8'
                      ].image
                    }
                    app={app}
                  />
                )}
              </Provider>
            </Stage>
          )}
        </div>
      </div>
    );
  }
}

SnackChat.propTypes = {
  setSnackChat: PropTypes.func.isRequired,
  setSendWithPhoto: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  storeList: PropTypes.object.isRequired,
  // actualItem: PropTypes.string.isRequired,
  predictionID: PropTypes.string
};

export default SnackChat;
