from flask import Flask, jsonify
from flask_cors import CORS 
from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
from bson.json_util import dumps
import base64
from io import BytesIO

app = Flask(__name__)

CORS(app)

client = MongoClient('mongodb+srv://mukeshpilane:123mukesh@cluster0.83vr0ru.mongodb.net/?retryWrites=true&w=majority')  # Replace with your MongoDB connection string
db = client['major-project']  # Replace with your database name
fs = gridfs.GridFS(db)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message='Hello, World!')

if __name__ == '__main__':
    app.run(debug=True)
