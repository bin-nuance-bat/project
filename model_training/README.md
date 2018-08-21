# Training the model

Everything you need to train and evaluate models is found in this directory.

## Prerequisites

To perform training you will need Python 2.7 installed as well as the `tensorflowjs_converter` package from pip.

```bash
$ pip install tensorflowjs
```

## Training Data

Training data should be placed in a directory `data` inside of this directory. In here you should have a subdirectory for each category of item you wish the model to recognise. These subdirectories should be named according to the items ID in the honesty.store. You should also include an unknown category. An example of the folder structure is shown below:

```
project
├── firebase
├── functions
├── model_training
|   ├── data
|   |   ├── 1eb45850-3bb1-4b66-a816-27d856f03afe
|   |   |   ├── 0UcozuglhkZrFXPaTDLX.jpg
|   |   |   ├── 0YAX6oF8H4lELvAs4Bt5.jpg
|   |   |   ...
|   |   ├── 02bbc0fd-54c4-45bb-9b77-21b79b356aa6
|   |   |   ├── 0yvz4mFTAkuiEIndHmS6.jpg
|   |   |   ├── 1d3IxV0ZVySjaMsBKo4x.jpg
|   |   |   ...
|   |   ├── unknown
|   |   |   ├── 0cLte488TJU9RnzyUMYG.jpg
|   |   |   ├── 0DaTNEiLWhlCFjA9Rhpp.jpg
|   |   |   ...
|   |   ...
|   ...
...
```

## Training

In order to train a new model based on the data provided in this directory, open up your terminal in this directory and run `train.sh`. Note this will perform ML training and may take some minutes and dramatically increase your CPU and memory usage.

Once training is complete you will see a new model has been generated in the `model` directory. This model is in the TensorFlow SavedModel format which cannot be used as is by the browser. However, the script also converts this model to a web freindly format and saves this in the correct place within the project (`public/model`) along with a JSON file that maps the models outputs to honesty.store IDs.

Therefore, once training is complete, you need only build and deploy the application again to see the new model take effect.

## Validation

Work in Progress.
