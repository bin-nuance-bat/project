import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ItemSelector from '../ItemSelector';
import DataController from '../utils/DataController';

const IMAGE_QUEUE_SIZE = 20;

class ImageApproval extends Component {
  state = {
    loading: true,
    image: null,
    images: [],
    storeList: {unknown: {name: 'Unknown', id: 'unknown'}}
  };

  getImages = async () => {
    return this.dataController
      .getImages(false, IMAGE_QUEUE_SIZE)
      .then(images => this.setState({images}));
  };

  displayNextImage = () => {
    this.setState(prevState => {
      const [image = null, ...images] = prevState.images;
      return {image, images};
    }, this.fetchImage);
  };

  fetchImage = () => {
    const lastImageTimestamp = prevImages => {
      return Math.max(...prevImages.map(i => i.timestamp));
    };

    if (this.state.images.length < IMAGE_QUEUE_SIZE) {
      const prevImages = [this.state.image, ...this.state.images].filter(
        image => image
      );
      const storedImageIds = prevImages.map(image => image.id);
      this.dataController
        .getImages(false, 3, lastImageTimestamp(prevImages))
        .then(images => {
          // Make sure we only include images not already in state
          const filtered = images.filter(
            image => !storedImageIds.includes(image.id)
          );
          this.setState(prevState => {
            return {
              images: prevState.images.concat(filtered)
            };
          });
        });
    }
  };

  trustImage = event => {
    const imageId = event.target.parentElement.parentElement.dataset.id;
    this.displayNextImage();
    this.dataController.trustImage(imageId);
  };

  setAsUnknown = event => {
    this.displayNextImage();
    const imageId = event.target.parentElement.parentElement.dataset.id;
    this.dataController.changeImageLabel(imageId, 'unknown');
    this.dataController.trustImage(imageId);
  };

  deleteImage = event => {
    this.displayNextImage();
    const imageId = event.target.parentElement.parentElement.dataset.id;
    this.dataController.deleteImage(imageId);
  };

  changeCategory = (id, newCategory) => {
    this.dataController.changeImageLabel(id, newCategory);
  };

  back = () => {
    this.props.history.replace('/admin');
  };

  componentDidMount() {
    this.dataController = new DataController();
    Promise.all([
      this.dataController.getStoreList().then(storeList => {
        this.setState({
          storeList
        });
      }),
      this.getImages().then(() => {
        this.displayNextImage();
      })
    ]).then(() => this.setState({loading: false}));
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
        {image ? (
          <div key={image.id} data-id={image.id} className="preview-pane">
            <h2>
              {this.state.storeList[image.label] !== undefined &&
                this.state.storeList[image.label].name}
            </h2>
            <div>
              <img style={{maxHeight: 224}} src={image.url} alt="" />
            </div>
            <ItemSelector
              item={image.label}
              items={Object.values(this.state.storeList)}
              setItem={cat => {
                this.changeCategory(image.id, cat);
                this.setState(prevState => ({
                  image: {...prevState.image, label: cat}
                }));
              }}
            />
            <div>
              <button className="button button-admin" onClick={this.trustImage}>
                Trust
              </button>
              <button
                className="button button-admin"
                onClick={this.setAsUnknown}>
                Unknown
              </button>
              <button
                className="button button-admin"
                onClick={this.deleteImage}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p>No more images to approve.</p>
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
