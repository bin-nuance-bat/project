import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DataController from '../utils/DataController';

import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';

class Viewer extends Component {
  state = {
    item: 'all',
    images: [],
    view: true,
    status: 'Loading...',
    items: {
      all: {name: 'All Items', id: 'all'},
      unknown: {name: 'Unknown Item', id: 'unknown'}
    }
  };

  componentDidMount() {
    this.data = new DataController();
    window.datac = this.data;
    this.data.getStoreList().then(store => {
      this.setState(prevState => ({
        items: {
          ...prevState.items,
          ...store
        },
        status: 'Ready'
      }));
    });
  }

  getImages = () => {
    this.setState({status: 'Fetching images...'});
    this.data.getImages(null, 500, 0, this.state.item).then(images =>
      this.setState({
        images,
        status: `Got ${images.length} images. Rendering... (May take a moment)`
      })
    );
  };

  toggleView = () => this.setState({view: !this.state.view});

  remove = event => {
    this.data.deleteImage(event.target.dataset.id).then(() => this.getImages());
  };

  trust = event => {
    this.data.trustImage(event.target.dataset.id).then(() => this.getImages());
  };

  trustUnknown = event => {
    this.data.changeImageLabel(event.target.dataset.id, 'unknown');
    this.data.trustImage(event.target.dataset.id).then(() => this.getImages());
  };

  back = () => {
    this.props.history.replace('/admin');
  };

  render() {
    return (
      <div className="page">
        <div>
          <button className="button button-admin" onClick={this.back}>
            &laquo; Back
          </button>
        </div>
        <ItemSelector
          item={this.state.item}
          items={Object.values(this.state.items)}
          setItem={item => this.setState({item})}
        />
        <button className="button button-admin" onClick={this.getImages}>
          Fetch Images
        </button>
        <button className="button button-admin" onClick={this.toggleView}>
          Toggle Previews
        </button>
        <br />

        <p>{this.state.status}</p>

        {this.state.view &&
          this.state.images.map(image => (
            <ImagePreview
              key={image.id}
              image={image}
              approve={this.trust}
              remove={this.remove}
              trustUnknown={this.trustUnknown}
            />
          ))}
      </div>
    );
  }
}

Viewer.propTypes = {
  history: PropTypes.object.isRequired
};

export default Viewer;
