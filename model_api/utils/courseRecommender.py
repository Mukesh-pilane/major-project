import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

df = pd.read_csv('./dumped_data/UCoursera_Courses.csv')

def recommend_courses(input_keyword, courses_df=df, num_recommendations=10):
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(courses_df['course_title'])
    
    keyword_vector = tfidf_vectorizer.transform([input_keyword])
    cosine_similarities = linear_kernel(keyword_vector, tfidf_matrix).flatten()
    
    course_indices = cosine_similarities.argsort()[::-1]
    recommended_courses = courses_df.iloc[course_indices][:num_recommendations]
    
    result = [{'title': title, 'organization': organization} for title, organization in recommended_courses[['course_title', 'course_organization']].values]

    return result


# input_keyword = "Web designing"

# recommended_courses = recommend_courses(input_keyword, df, num_recommendations=10)

# if not recommended_courses.empty:
#     print("Recommended Courses for Keyword:", input_keyword)
#     print(type(recommended_courses))
# else:
#     print("No matching courses found for keyword:", input_keyword)
