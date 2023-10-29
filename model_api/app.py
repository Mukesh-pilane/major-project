from flask import Flask, jsonify, request
import sys
import os
import nltk
nltk.download('punkt')
nltk.download('stopwords')
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), './')))
from flask_cors import CORS 
from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
from bson.json_util import dumps
import base64
import io 
from utils import predict_resume_category, pdfTextExtractor, calculate_cosine_similarity , recommend_courses
import fitz

# from nltk.data import find

# # Check if the 'punkt' data is already downloaded
# try:
#     find('tokenizers/punkt')
#     find('tokenizers/stopwords')
# except LookupError:
#     # If it's not downloaded, download it
#     nltk.download('punkt')
#     nltk.download('stopwords')




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
        print("job_description", job_description)
        binary_data = base64.b64decode(base64_string)
        file = io.BytesIO(binary_data)
        if file:
        # Process the uploaded PDF file using the "fitz" module
            pdf_document = fitz.open(stream=file.read(), filetype="pdf")
            resume_text = pdfTextExtractor(pdf_document)
            print("resume_txt", resume_text)
            classified = predict_resume_category(resume_text)
            rankScore = calculate_cosine_similarity(job_description, resume_text)
            print({"classified" : classified, "Score":rankScore})
            return {"classified" : classified, "score":rankScore}, 200

@app.route("/api/getResume", methods=["POST"])
def retrieveResume():
     print("check args",request.json)
     file_id = ObjectId(request.json.get('id'))
     file = fs.get(file_id)
     file_contents_base64 = base64.b64encode(file.read()).decode('utf-8')
     print("data",file_contents_base64)
     return {"file" : file_contents_base64}

@app.route('/api/recommend', methods=['GET'])
def get_recommendations():
    input_keyword = request.args.get('keyword', default=None)
    
    if input_keyword is not None:
        recommended_courses = recommend_courses(input_keyword, num_recommendations=10)
        if recommended_courses:
            return jsonify({"Courses": recommended_courses})
        else:
            return jsonify({"message": "No matching courses found for keyword: " + input_keyword})
    else:
        return jsonify({"error": "Please provide a 'keyword' parameter."})

if __name__ == '__main__':
    app.run(debug=True)
