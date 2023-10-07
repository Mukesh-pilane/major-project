import math
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Preprocess the text data
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalnum() and word.lower() not in stop_words]
    return ' '.join(words)


# Calculate TF-IDF vectors
def calculate_cosine_similarity(job_description_text, resume_text):
    job_description = preprocess_text(job_description_text)
    resume = preprocess_text(resume_text)
    # print('preprossed', type(resume))
    # print('preprossed', type(job_description))

    # Initialize the TF-IDF vectorizer
    tfidf_vectorizer = TfidfVectorizer()

    # Fit and transform the job description and resume into TF-IDF vectors
    tfidf_matrix = tfidf_vectorizer.fit_transform([job_description, resume])

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
    
    # Return the cosine similarity score
    return math.floor(cosine_sim[0][0]*100)
