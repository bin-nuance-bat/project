import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ItemSelector from '../ItemSelector';
import DataController from '../utils/DataController';

import './Approval.css';

class ImageApproval extends Component {
  state = {
    loading: true,
    images: [],
    storeList: [{name: 'unknown', id: 'unknown'}]
  };

  getImages = async () => {
    return this.dataController
      .getImages(false, 10)
      .then(images => this.setState({images}));
  };

  lastImageTimestamp = () => {
    return this.state.images.reduce(
      (highest, current) => Math.max(highest, current.timestamp),
      0
    );
  };

  nextImage = index => {
    return this.dataController
      .getImages(false, 1, this.lastImageTimestamp())
      .then(images => {
        this.setState(prevState => {
          if (images.length < 1) {
            prevState.images.splice(index, 1);
          } else {
            const [image] = images;
            if (prevState.images.filter(i => i.id === image.id).length > 0) {
              this.getImages();
            } else {
              prevState.images[index] = image;
            }
          }
          return prevState;
        });
      });
  };

  trustImage = event => {
    const index = event.target.dataset.index;
    this.dataController
      .trustImage(event.target.dataset.id)
      .then(() => this.nextImage(index));
  };

  setAsUnknown = event => {
    const index = event.target.dataset.index;
    this.dataController.changeImageLabel(event.target.dataset.id, 'unknown');
    this.dataController
      .trustImage(event.target.dataset.id)
      .then(() => this.nextImage(index));
  };

  deleteImage = event => {
    const index = event.target.dataset.index;
    this.dataController
      .deleteImage(event.target.dataset.id)
      .then(() => this.nextImage(index));
  };

  changeCategory = (id, newCategory) => {
    this.dataController.changeImageLabel(id, newCategory);
  };

  back = () => {
    this.props.history.replace('/admin');
  };

  componentDidMount() {
    this.dataController = new DataController();
    this.dataController.getStoreList().then(storeList => {
      this.setState({
        storeList: Object.values({
          ...storeList
        })
      });
      this.getImages().then(() => this.setState({loading: false}));
    });
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    if (this.state.images === [])
      return <div>No untrusted images available</div>;

    return (
      <div className="preview">
        <div>
          <button className="button button-admin" onClick={this.back}>
            &laquo; Back
          </button>
        </div>
        {this.state.images.map((image, index) => {
          return (
            <div key={image.id} className="preview-pane">
              <img style={{maxHeight: 224}} src={image.url} alt="" />
              <ItemSelector
                item={image.label}
                items={this.state.storeList}
                setItem={cat => {
                  this.changeCategory(image.id, cat);
                  this.setState(prevState => {
                    prevState.images[index].label = cat;
                    return prevState;
                  });
                }}
              />
              <div>
                <button
                  className="button button-admin"
                  data-id={image.id}
                  data-index={index}
                  data-label={image.label}
                  onClick={this.trustImage}>
                  Trust
                </button>
                <button
                  className="button button-admin"
                  data-id={image.id}
                  data-index={index}
                  onClick={this.setAsUnknown}>
                  Unknown
                </button>
                <button
                  className="button button-admin"
                  data-id={image.id}
                  data-index={index}
                  data-label={image.label}
                  onClick={this.deleteImage}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ImageApproval.propTypes = {
  history: PropTypes.object.isRequired
};

export default ImageApproval;
