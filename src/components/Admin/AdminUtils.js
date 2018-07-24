import * as tf from '@tensorflow/tfjs';

const cropImage = img => {
  const size = Math.min(img.shape[0], img.shape[1]);
  const centerHeight = img.shape[0] / 2;
  const beginHeight = centerHeight - size / 2;
  const centerWidth = img.shape[1] / 2;
  const beginWidth = centerWidth - size / 2;

  return tf.image.resizeBilinear(
    img.slice([beginHeight, beginWidth, 0], [size, size, 3]),
    [224, 224]
  );
};

export const uriToTensor = dataURI => {
  return tf.tidy(() => {
    return cropImage(tf.fromPixels(dataURI))
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(127))
      .sub(tf.scalar(1));
  });
};
