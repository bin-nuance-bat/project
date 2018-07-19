import * as tf from '@tensorflow/tfjs';

export const uriToTensor = dataURI => {
	return tf.tidy(() => {
		return this.cropImage(tf.fromPixels(dataURI))
			.expandDims(0)
			.toFloat()
			.div(tf.scalar(127))
			.sub(tf.scalar(1));
	});
};
