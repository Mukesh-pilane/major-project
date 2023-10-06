from flask import Flask, jsonify, request
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), './')))
from flask_cors import CORS 
from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
from bson.json_util import dumps
import base64
import io 
from utils import predict_resume_category, pdfTextExtractor, cosine_similarity
import fitz



app = Flask(__name__)

CORS(app)

client = MongoClient('mongodb+srv://mukeshpilane:123mukesh@cluster0.83vr0ru.mongodb.net/?retryWrites=true&w=majority')  # Replace with your MongoDB connection string
db = client['major-project']  # Replace with your database name
fs = gridfs.GridFS(db)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message='Hello, World!')

@app.route('/api/ranker', methods=['POST'])
def resumeRank():
    if(request.method == 'POST'):
        if 'file' not in request.form:
            return "No file part", 404
        base64_string = request.form["file"]
        job_description = request.form["job_description"]
        binary_data = base64.b64decode(base64_string)
        file = io.BytesIO(binary_data)
        if file:
        # Process the uploaded PDF file using the "fitz" module
            pdf_document = fitz.open(stream=file.read(), filetype="pdf")
            resume_text = pdfTextExtractor(pdf_document)
            category = predict_resume_category(resume_text)
            rankScore = cosine_similarity(job_description, resume_text)
            return {"category" : category, "Score":rankScore}, 200

if __name__ == '__main__':
    app.run(debug=True)
