from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from keras.preprocessing.image import img_to_array
from keras.applications.resnet50 import preprocess_input
from PIL import Image

app = Flask(__name__)
CORS(app)

labels = ["Accident", "Normal"]

@app.route('/predict', methods=['POST'])
def predict_image():
    # Check if the POST request contains a file
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    # Check if the file has an allowed extension (e.g., .png, .jpg)
    allowed_extensions = {'png', 'jpg', 'jpeg'}
    if file.filename.split('.')[-1].lower() not in allowed_extensions:
        return jsonify({"error": "Invalid file type"}), 400

    # Process the image
    input_img = Image.open(file)
    resized_image = input_img.resize((224,224))
    image_array = img_to_array(resized_image)
    image_array = tf.expand_dims(image_array, 0)
    img_array = preprocess_input(image_array)
    # Perform any necessary preprocessing on the image before using the model
    # ...

    # Assuming your_model.pkl is a trained model
    model = load_model('Resources/model.h5')

    # Make a prediction
    prediction = model.predict(img_array).flatten()
    prediction = prediction.tolist()
    if prediction[0] > 0.8:
        # return jsonify({"prediction": labels[0], "Confidence": prediction[0]})
        # return render_template("index.html", ml_result="The prediction is {}".format(labels[0]))
        return labels[0]
    else:
        # return jsonify({"prediction": labels[1], "Confidence": prediction[1]})
        # return render_template("index.html", ml_result="The prediction is {}".format(labels[1]))
        return labels[1]

if __name__ == '__main__':
    app.run(debug=False)
