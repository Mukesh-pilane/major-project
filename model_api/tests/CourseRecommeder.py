import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load the dataset
df = pd.read_csv('../dumped_data/UCoursera_Courses.csv')

# Input keyword
input_keyword = "Web designing"

# Use TF-IDF Vectorization to convert course descriptions to numerical vectors
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df['course_title'])

# Calculate cosine similarity between the input keyword and course titles
keyword_vector = tfidf_vectorizer.transform([input_keyword])
cosine_similarities = linear_kernel(keyword_vector, tfidf_matrix).flatten()

# Sort courses by similarity and get the top recommendations
course_indices = cosine_similarities.argsort()[::-1]
recommended_courses = df.iloc[course_indices][:10]  # Adjust the number of recommendations as needed

# Display recommended courses
if not recommended_courses.empty:
    print("Recommended Courses for Keyword:", input_keyword)
    print(recommended_courses[['course_title', 'course_organization']])
else:
    print("No matching courses found for keyword:", input_keyword)