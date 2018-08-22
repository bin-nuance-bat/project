# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse

import numpy as np
import tensorflow as tf

import json
import os
import sys


def load_graph(model_file):
  graph = tf.Graph()
  graph_def = tf.GraphDef()

  with open(model_file, "rb") as f:
    graph_def.ParseFromString(f.read())
  with graph.as_default():
    tf.import_graph_def(graph_def)

  return graph


def read_tensor_from_image_file(file_name,
                                input_height=299,
                                input_width=299,
                                input_mean=0,
                                input_std=255):
  input_name = "file_reader"
  output_name = "normalized"
  file_reader = tf.read_file(file_name, input_name)
  if file_name.endswith(".png"):
    image_reader = tf.image.decode_png(
        file_reader, channels=3, name="png_reader")
  elif file_name.endswith(".gif"):
    image_reader = tf.squeeze(
        tf.image.decode_gif(file_reader, name="gif_reader"))
  elif file_name.endswith(".bmp"):
    image_reader = tf.image.decode_bmp(file_reader, name="bmp_reader")
  else:
    image_reader = tf.image.decode_jpeg(
        file_reader, channels=3, name="jpeg_reader")
  float_caster = tf.cast(image_reader, tf.float32)
  dims_expander = tf.expand_dims(float_caster, 0)
  resized = tf.image.resize_bilinear(dims_expander, [input_height, input_width])
  normalized = tf.divide(tf.subtract(resized, [input_mean]), [input_std])
  sess = tf.Session()
  result = sess.run(normalized)

  return result


def load_labels(label_file):
  label = []
  with open(label_file) as f:
    label = json.load(f)
  return label


def path_to_dict(path):
    d = {'name': os.path.basename(path)}
    if os.path.isdir(path):
        d['type'] = "directory"
        d['children'] = [path_to_dict(os.path.join(path,x)) for x in os.listdir(path)]
    else:
        d['type'] = "file"
    return d


if __name__ == "__main__":
  model_file = "tmp/output_graph.pb"
  label_file = "../public/model/labels.json"
  input_height = 224
  input_width = 224
  input_mean = 0
  input_std = 255
  input_layer = "Placeholder"
  output_layer = "final_result"

  parser = argparse.ArgumentParser()
  parser.add_argument("--image", help="image to be processed")
  parser.add_argument("--graph", help="graph/model to be executed")
  parser.add_argument("--labels", help="name of file containing labels")
  parser.add_argument("--input_height", type=int, help="input height")
  parser.add_argument("--input_width", type=int, help="input width")
  parser.add_argument("--input_mean", type=int, help="input mean")
  parser.add_argument("--input_std", type=int, help="input std")
  parser.add_argument("--input_layer", help="name of input layer")
  parser.add_argument("--output_layer", help="name of output layer")
  args = parser.parse_args()

  if args.graph:
    model_file = args.graph
  if args.image:
    file_name = args.image
  if args.labels:
    label_file = args.labels
  if args.input_height:
    input_height = args.input_height
  if args.input_width:
    input_width = args.input_width
  if args.input_mean:
    input_mean = args.input_mean
  if args.input_std:
    input_std = args.input_std
  if args.input_layer:
    input_layer = args.input_layer
  if args.output_layer:
    output_layer = args.output_layer

  graph = load_graph(model_file)
  labels = load_labels(label_file)
  readable_labels = load_labels("readable_labels.json")
  
  input_name = "import/" + input_layer
  output_name = "import/" + output_layer
  input_operation = graph.get_operation_by_name(input_name)
  output_operation = graph.get_operation_by_name(output_name)

  correct_guesses = 0
  incorrect_guesses = 0
  test_data = path_to_dict('./eval_data')['children']
  num_classes = len(test_data)
  res_file = open("results.csv", "w")
  res_file.write("Item,Correct Predictions,Mean Certainty\n")

  for idx, label in enumerate(test_data):
    if label['type'] != "directory":
      continue
    
    certainty = 0
    guesses = [0, 0]

    for img in label['children']:
      file_name = "./eval_data/" + label['name'] + "/" + img['name']
      t = read_tensor_from_image_file(
        file_name,
        input_height=input_height,
        input_width=input_width,
        input_mean=input_mean,
        input_std=input_std)

      with tf.Session(graph=graph) as sess:
        results = sess.run(output_operation.outputs[0], {
            input_operation.outputs[0]: t
        })
      results = np.squeeze(results)
      top_k = results.argsort()[-3:][::-1]

      if (labels[top_k[0]] == label['name']):
        correct_guesses = correct_guesses + 1
        guesses[0] = guesses[0] + 1
      else:
        incorrect_guesses = incorrect_guesses + 1
        guesses[1] = guesses[1] + 1

      for i in top_k:
        if labels[i] == label['name']:
          certainty = certainty + results[i]
    
    res_file.write(
      "{},{}%,{}%\n".format(
        readable_labels[label['name']],
        round(100 * guesses[0] / (guesses[0] + guesses[1])),
        round(certainty * 100 / len(label['children']), 2))
    )

    sys.stdout.write("Evaluating model: [{}{}] {}%".format("=" * idx, " " * (num_classes - idx), round(100 * idx / num_classes)))
    sys.stdout.flush()
    sys.stdout.write("\b" * (num_classes + 24))
  sys.stdout.write("\n")

  accuracy = 100 * correct_guesses / (correct_guesses + incorrect_guesses)

  res_file.write(
    "Overall,{}%\n".format(
      readable_labels[label['name']],
      round(accuracy, 1)
    )
  )
  res_file.close()
  
  print("Overall model accuracy: " + str(round(accuracy, 1)) + "%")
  print("For detailed results see generated results.csv")
