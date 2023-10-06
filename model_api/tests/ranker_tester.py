import nltk
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz
import math
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

pdf_resume_path = '../dumped_data/resume1.pdf'
text_job_description_path = '../dumped_data/sampleJobDescription.txt'

# Extract text from the PDF resume
def extract_text_from_pdf(pdf_path):
    text = ""
    pdf_document = fitz.open(pdf_path)
    for page_number in range(len(pdf_document)):
        page = pdf_document[page_number]
        text += page.get_text()
    return text

def read_text_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text

# Extract text from the PDF resume
resume_text = extract_text_from_pdf(pdf_resume_path)

# Read the job description text from a text file
job_description_text = read_text_from_file(text_job_description_path)

# Preprocess the text data
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalnum() and word.lower() not in stop_words]
    return ' '.join(words)

job_description = preprocess_text(job_description_text)
resume = preprocess_text(resume_text)

# Calculate TF-IDF vectors
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform([job_description, resume])

# Calculate cosine similarity
cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])

# Print the cosine similarity score
print(f"Cosine Similarity Score: {math.floor(cosine_sim[0][0]*100)}")