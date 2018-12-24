#can't use latest version of pillow as it has a bug https://github.com/python-pillow/Pillow/issues/2724
#use pip install pillow==4.1.1
from PIL import Image
import os
import sys

training_data_directory = "training_data/"

for directory in os.listdir(training_data_directory):
    print("Resizing images %s" % directory)
    for file_name in os.listdir(training_data_directory + directory):
        image = Image.open(os.path.join(training_data_directory, directory, file_name))

        imageResized = image.resize((160, 160), Image.ANTIALIAS)

        imageResized_file_name = os.path.join(training_data_directory, directory, file_name)
        imageResized.save(imageResized_file_name, "JPEG")

print("Completed resizing")