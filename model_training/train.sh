rm -rf model
python retrain.py --image_dir training_data --tfhub_module https://tfhub.dev/google/imagenet/mobilenet_v1_025_224/feature_vector/1 --saved_model_dir model --output_labels ../public/model/labels.json
tensorflowjs_converter --input_format=tf_saved_model --output_node_names=final_result model ../public/model
