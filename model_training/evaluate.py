from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse

import numpy as np
import tensorflow as tf
from tensorflow.contrib import predictor

import json
import os
import sys


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

def print_loading_bar(completion, width=60):
  done = round(completion * width)
  remaining = width - done
  percentage = round(completion * 100)

  sys.stdout.write("\b" * (width + 21 + len(str(percentage))))
  sys.stdout.write("Evaluating model: {}{} {}% ".format("█" * done, "▒" * remaining, percentage))
  sys.stdout.flush()


if __name__ == "__main__":
  label_file = "../public/model/labels.json"
  input_height = 224
  input_width = 224
  input_mean = 0
  input_std = 255
  input_layer = "Placeholder"
  output_layer = "final_result"

  labels = load_labels(label_file)
  readable_labels = load_labels("readable_labels.json")

  correct_guesses = 0
  incorrect_guesses = 0
  test_data = path_to_dict('./eval_data')['children']
  num_classes = len(test_data)
  res_file = open("results.csv", "w")
  res_file.write("Item,Correct Predictions,Mean Certainty,Mean Ratio,Incorrect Labels\n")

  with tf.Session(graph=tf.Graph()) as sess:
    tf.saved_model.loader.load(
        sess,
        [tf.saved_model.tag_constants.SERVING],
        "model"
    )

    print_loading_bar(0)

    for idx, label in enumerate(test_data):
      if label['type'] != "directory":
        continue
      
      certainty = 0
      guesses = [0, 0] # correct, incorrect
      ratio = 0
      incorrect_labels = []

      for img in label['children']:
        file_name = "./eval_data/" + label['name'] + "/" + img['name']
        t = read_tensor_from_image_file(
          file_name,
          input_height=input_height,
          input_width=input_width,
          input_mean=input_mean,
          input_std=input_std)

        
        results = sess.run("final_result:0", {
            "Placeholder:0": t
        })
        results = np.squeeze(results)
        top_k = results.argsort()[-3:][::-1]

        if (labels[top_k[0]] == label['name']):
          correct_guesses = correct_guesses + 1
          guesses[0] = guesses[0] + 1
          ratio = ratio + (results[top_k[0]] / results[top_k[1]])
        else:
          incorrect_guesses = incorrect_guesses + 1
          guesses[1] = guesses[1] + 1
          incorrect_labels.append(readable_labels[labels[top_k[0]]])

        for i in top_k:
          if labels[i] == label['name']:
            certainty = certainty + results[i]
      
      res_file.write(
        "{},{}%,{}%,{},{}\n".format(
          readable_labels[label['name']],
          round(100 * guesses[0] / (guesses[0] + guesses[1])),
          round(certainty * 100 / len(label['children']), 2),
          round(ratio / len(label['children']), 2),
          '"' + ", ".join(incorrect_labels) + '"'
        )
      )

      print_loading_bar((idx + 1) / num_classes)
      
  sys.stdout.write("\n")

  accuracy = 100 * correct_guesses / (correct_guesses + incorrect_guesses)

  res_file.write(
    "Overall,{}%\n".format(
      round(accuracy, 1)
    )
  )
  res_file.close()

  print("Overall model accuracy: " + str(round(accuracy, 1)) + "%")
  print("For detailed results see generated results.csv")
