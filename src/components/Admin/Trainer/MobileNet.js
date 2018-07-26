import * as net from '@tensorflow-models/mobilenet';

export default class MobileNet {
  async init() {
    return net.load().then(res => {
      this.net = res;
    });
  }

  isReady() {
    return !(this.net === undefined);
  }

  async getActivation(img) {
    if (typeof img === 'string') img = await this.uriToImg(img);
    if (this.isReady()) {
      return this.net.infer(img, 'conv_pw_13_relu');
    }
  }

  async uriToImg(uri) {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = uri;
    });
  }
}
