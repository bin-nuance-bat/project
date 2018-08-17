import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ItemSelector from '../ItemSelector';
import DataController from '../utils/DataController';

import './Approval.css';

const IMAGE_QUEUE_SIZE = 20;

class ImageApproval extends Component {
  state = {
    loading: true,
    image: null,
    images: [],
    storeList: [{name: 'unknown', id: 'unknown'}],
    index: 0
  };

  getImages = async () => {
    return this.dataController
      .getImages(false, IMAGE_QUEUE_SIZE)
      .then(images => this.setState({images}));
  };

  lastImageTimestamp = () => {
    return Math.max(
      this.state.images.reduce(
        (highest, current) => Math.max(highest, current.timestamp),
        0
      ),
      this.state.image.timestamp
    );
  };

  displayNextImage = () => {
    this.setState(prevState => {
      return {image: prevState.images.shift(), images: prevState.images};
    });

    this.fetchImage();
  };

  fetchImage = () => {
    if (this.state.images.length < IMAGE_QUEUE_SIZE) {
      this.dataController
        .getImages(false, 5, this.lastImageTimestamp())
        .then(images => {
          const newImages = [];
          for (const image of images) {
            if (this.state.images.filter(i => i.id === image.id).length === 0)
              newImages.push(image);
          }
          this.setState(prevState => {
            prevState.images.push(...newImages);
            if (prevState.images.length < IMAGE_QUEUE_SIZE) this.fetchImage();
            return prevState;
          });
        });
    }
  };

  trustImage = event => {
    this.displayNextImage();
    this.dataController.trustImage(event.target.dataset.id);
  };

  setAsUnknown = event => {
    this.displayNextImage();
    this.dataController.changeImageLabel(event.target.dataset.id, 'unknown');
    this.dataController.trustImage(event.target.dataset.id);
  };

  deleteImage = event => {
    this.displayNextImage();
    this.dataController.deleteImage(event.target.dataset.id);
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
      this.getImages().then(() => {
        this.displayNextImage();
        this.setState({loading: false});
      });
    });
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    if (this.state.images === [])
      return <div>No untrusted images available</div>;

    const {image} = this.state;
    return (
      <div className="preview">
        <div>
          <button className="button button-admin" onClick={this.back}>
            &laquo; Back
          </button>
        </div>
        {image && (
          <div key={image.id} className="preview-pane">
            <img style={{maxHeight: 224}} src={image.url} alt="" />
            <ItemSelector
              item={image.label}
              items={this.state.storeList}
              setItem={cat => {
                this.changeCategory(image.id, cat);
                this.setState(prevState => {
                  prevState.image.label = cat;
                  return prevState;
                });
              }}
            />
            <div>
              <button
                className="button button-admin"
                data-id={image.id}
                data-label={image.label}
                onClick={this.trustImage}>
                Trust
              </button>
              <button
                className="button button-admin"
                data-id={image.id}
                onClick={this.setAsUnknown}>
                Unknown
              </button>
              <button
                className="button button-admin"
                data-id={image.id}
                data-label={image.label}
                onClick={this.deleteImage}>
                Delete
              </button>
            </div>
          </div>
        )}
        {/* Used to load images in background - speeds up rendering. */}
        <div hidden>
          {this.state.images.map(i => (
            <img key={i.id} src={i.url} alt="" />
          ))}
        </div>
      </div>
    );
  }
}

ImageApproval.propTypes = {
  history: PropTypes.object.isRequired
};

export default ImageApproval;
