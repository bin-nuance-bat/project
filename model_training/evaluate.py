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
import threading


def load_json(file_name):
    with open(file_name) as f:
        file = json.load(f)
    return file


def read_tensor_from_image_file(file_name, input_height=224, input_width=224, input_mean=0, input_std=255):
    input_name = "file_reader"
    file_reader = tf.read_file(file_name, input_name)
    image_reader = tf.image.decode_jpeg(
        file_reader, channels=3, name="jpeg_reader")

    float_caster = tf.cast(image_reader, tf.float32)
    dims_expander = tf.expand_dims(float_caster, 0)
    resized = tf.image.resize_bilinear(
        dims_expander, [input_height, input_width])
    normalized = tf.divide(tf.subtract(resized, [input_mean]), [input_std])

    sess = tf.Session()
    result = sess.run(normalized)

    return result


def path_to_dict(path):
    d = {'name': os.path.basename(path)}
    if os.path.isdir(path):
        d['type'] = "directory"
        d['children'] = [path_to_dict(os.path.join(path, x))
                         for x in os.listdir(path)]
    else:
        d['type'] = "file"
    return d


def print_loading_bar(completion, status, width=60):
    done = round(completion * width)
    remaining = width - done
    percentage = round(completion * 100)
    message = "  {:3}%  {}{} {}".format(
        percentage, "█" * done, "▒" * remaining, status) + " " * 20

    sys.stdout.write(message)
    sys.stdout.write("\b" * len(message))
    sys.stdout.flush()


class Evaluator:
    def __init__(self, img_size):
        self.img_size = img_size
        self.total_correct_guesses = 0
        self.total_incorrect_guesses = 0
        self.labels = load_json("../public/model/labels.json")
        self.readable_labels = load_json("readable_labels.json")

    def to_label(self, index):
        return self.labels[index]

    def to_name(self, label):
        return self.readable_labels[label]

    def test_image(self, sess, label, img, res):
        file_name = "./eval_data/" + label + "/" + img
        t = read_tensor_from_image_file(
            file_name, input_height=self.img_size, input_width=self.img_size)

        results = sess.run("final_result:0", {
            "Placeholder:0": t
        })

        results = np.squeeze(results)
        top_k = results.argsort()[-3:][::-1]

        if (self.to_label(top_k[0]) == label):
            self.total_correct_guesses += 1
            res['correct_guesses'] += 1
            res['ratio'] += (results[top_k[0]] / results[top_k[1]])
        else:
            self.total_incorrect_guesses += 1
            res['incorrect_guesses'] += 1
            res['incorrect_labels'].append(
                self.to_name(self.to_label(top_k[0])))

        for i in top_k:
            if self.to_label(i) == label:
                res['certainty'] += results[i]


if __name__ == "__main__":
    test_data = path_to_dict('./eval_data')['children']
    num_classes = len(test_data)

    res_file = open("results.csv", "w")
    res_file.write(
        "Item,Correct Predictions,Mean Certainty,Mean Ratio,Incorrect Labels\n")

    with tf.Session(graph=tf.Graph()) as sess:
        tf.saved_model.loader.load(
            sess,
            [tf.saved_model.tag_constants.SERVING],
            "model"
        )

        eval = Evaluator(img_size=160)
        print("\nEvaluating model...")
        print_loading_bar(0, "Testing...")

        for idx, label in enumerate(test_data):
            if label['type'] != "directory":
                continue

            results = {
                'correct_guesses': 0,
                'incorrect_guesses': 0,
                'certainty': 0,
                'ratio': 0,
                'incorrect_labels': []
            }

            threads = []
            for img in label['children']:
                t = threading.Thread(target=eval.test_image, args=(
                    sess, label['name'], img['name'], results,))
                threads.append(t)
                t.start()

            for t in threads:
                t.join()

            res_file.write(
                "{},{}%,{}%,{},{}\n".format(
                    eval.to_name(label['name']),
                    round(100 * results['correct_guesses'] /
                          (results['correct_guesses'] + results['incorrect_guesses'])),
                    round(results['certainty'] * 100 /
                          len(label['children']), 2),
                    round(results['ratio'] / len(label['children']), 2),
                    '"' + ", ".join(results['incorrect_labels']) + '"'
                )
            )

            print_loading_bar((idx + 1) / num_classes,
                              "Testing {}...".format(eval.to_name(label['name'])))

    sys.stdout.write("\n\n")

    accuracy = 100 * eval.total_correct_guesses / \
        (eval.total_correct_guesses + eval.total_incorrect_guesses)

    res_file.write(
        "Overall,{}%\n".format(
            round(accuracy, 1)
        )
    )
    res_file.close()

    print("Overall model accuracy: " + str(round(accuracy, 1)) + "%")
    print("See generated results.csv for more details.")
