from flask import Flask, render_template, request, redirect, url_for
from tensorflow import keras
import numpy as np
import os
from PIL import Image

app = Flask(__name__)

generator = keras.models.load_model("gan_model.h5")

@app.route("/", methods=["GET"])
def home():
    return render_template("home.html")

@app.route("/generator", methods=["POST"])
def generate():
    input_image = request.files["input-image"]

    input_image_path = "input_image.jpg"
    input_image.save(input_image_path)

    input_image = Image.open(input_image_path).convert("L")
    input_image = input_image.resize((28, 28))
    input_image = np.array(input_image) / 255.0
    input_image = np.expand_dims(input_image, axis=0)
    input_image = np.expand_dims(input_image, axis=3)

    generated_image = generator.predict(input_image)[0]

    generated_image_path = "generated_image.jpg"
    generated_image = (generated_image * 0.5 + 0.5) * 255.0
    generated_image = generated_image.astype(np.uint8)
    generated_image = Image.fromarray(generated_image.squeeze())
    generated_image.save(generated_image_path)

    input_image_url = url_for(filename="input_image.jpg")
    generated_image_url = url_for(filename="generated_image.jpg")

    return render_template("generator.html", input_image_url=input_image_url, generated_image_url=generated_image_url)

if __name__ == "__main__":
    app.run(debug=True)
