# Import necessary libraries
import re
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
import fitz  # PyMuPDF
import pickle

# Save the trained classifier model using pickle


def extract_text_from_pdf(pdf_path):
    text = ""
    pdf_document = fitz.open(pdf_path)
    
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")
    
    pdf_document.close()
    return text

# Replace 'your_pdf_file.pdf' with the actual path to your PDF file
pdf_path = 'resume3.pdf'
extracted_text = extract_text_from_pdf(pdf_path)


# New resume text that you want to classify
new_resume = extracted_text

# Preprocess the new resume text
def cleanResume(resumeText):
    resumeText = re.sub('http\S+\s*', ' ', resumeText)
    resumeText = re.sub('RT|cc', ' ', resumeText)
    resumeText = re.sub('#\S+', '', resumeText)
    resumeText = re.sub('@\S+', '  ', resumeText)
    resumeText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', resumeText)
    resumeText = re.sub(r'[^\x00-\x7f]',r' ', resumeText)
    resumeText = re.sub('\s+', ' ', resumeText)
    return resumeText

cleaned_new_resume = cleanResume(new_resume)

# # Vectorize the cleaned new resume text
# word_vectorizer = TfidfVectorizer(
#     sublinear_tf=True,
#     stop_words='english')
# word_vectorizer.fit(requiredText)  # Use the same vectorizer used during training
# new_resume_features = word_vectorizer.transform([cleaned_new_resume])

# # Make a prediction using the trained classifier
# predicted_category = clf.predict(new_resume_features)

# # Inverse transform the predicted label to get the original category name
# predicted_category_name = le.inverse_transform([predicted_category])

# print("Predicted Category:", predicted_category_name[0])

clf=""
model_filename = 'resume_classifier_model.pkl'
with open(model_filename, 'wb') as model_file:
    pickle.dump(clf, model_file)


def classifier(pdf):
    new_resume = extracted_text
    cleaned_new_resume = cleanResume(new_resume)
    word_vectorizer = TfidfVectorizer(
    sublinear_tf=True,
    stop_words='english')
    word_vectorizer.fit(cleaned_new_resume)  # Use the same vectorizer used during training
    new_resume_features = word_vectorizer.transform([cleaned_new_resume])
    return "text"
