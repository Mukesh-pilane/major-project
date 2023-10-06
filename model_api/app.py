from flask import Flask, jsonify, request
from flask_cors import CORS 
from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
from bson.json_util import dumps
import base64
from io import BytesIO
from utils import classifier
import fitz

app = Flask(__name__)

CORS(app)

client = MongoClient('mongodb+srv://mukeshpilane:123mukesh@cluster0.83vr0ru.mongodb.net/?retryWrites=true&w=majority')  # Replace with your MongoDB connection string
db = client['major-project']  # Replace with your database name
fs = gridfs.GridFS(db)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message='Hello, World!')

@app.route('/api/ranker', methods=['post'])
def resumeRank():
    if(request.method == 'POST'):
        if 'file' not in request.files:
            return "No file part", 404
        file = request.files['file']
        if file.filename == '':
            return "No selected file", 404
        if file:
        # Process the uploaded PDF file using the "fitz" module
            pdf_document = fitz.open(stream=file.read(), filetype="pdf")
            category = classifier(pdf_document)
            return {"category" : category}, 200

if __name__ == '__main__':
    app.run(debug=True)
