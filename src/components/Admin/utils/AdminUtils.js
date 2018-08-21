import * as tf from '@tensorflow/tfjs';

const cropImage = img => {
  const [height, width] = img.shape;
  const size = Math.min(height, width);
  const centerHeight = height / 2;
  const beginHeight = centerHeight - size / 2;
  const centerWidth = width / 2;
  const beginWidth = centerWidth - size / 2;

  return tf.image.resizeBilinear(
    img.slice([beginHeight, beginWidth, 0], [size, size, 3]),
    [224, 224]
  );
};

export const imageToTensor = image => {
  return tf.tidy(() => {
    return cropImage(tf.fromPixels(image))
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(127))
      .sub(tf.scalar(1));
  });
};
