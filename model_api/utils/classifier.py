import re
import pickle
# from sklearn.exceptions import InconsistentVersionWarning
# import warnings

# # Filter out the InconsistentVersionWarning for LabelBinarizer
# warnings.filterwarnings("ignore", category=InconsistentVersionWarning, module="sklearn.base")
import nltk
from nltk.data import find

# Check if the 'punkt' data is already downloaded
try:
    find('tokenizers/punkt')
    find('tokenizers/stopwords')
except LookupError:
    # If it's not downloaded, download it
    nltk.download('punkt')
    nltk.download('stopwords')

def clean_resume(resume_text):
    resume_text = re.sub('http\S+\s*', ' ', resume_text)
    resume_text = re.sub('RT|cc', ' ', resume_text)
    resume_text = re.sub('#\S+', '', resume_text)
    resume_text = re.sub('@\S+', '  ', resume_text)
    resume_text = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', resume_text)
    resume_text = re.sub(r'[^\x00-\x7f]', r' ', resume_text)
    resume_text = re.sub('\s+', ' ', resume_text)
    return resume_text

def predict_resume_category(extracted_text, model_path='./dumped_data/resume_classifier_model.pkl', encoder_path='./dumped_data/resume_classifier_label_encoder.pkl', vectorizer_path='./dumped_data/resume_classifier_tfidf_vectorizer.pkl'):
    with open(encoder_path, 'rb') as encoder_file:
        le = pickle.load(encoder_file)

    with open(model_path, 'rb') as model_file:
        clf = pickle.load(model_file)

    with open(vectorizer_path, 'rb') as vectorizer_file:
        word_vectorizer = pickle.load(vectorizer_file)
    
    cleaned_new_resume = clean_resume(extracted_text)
    new_resume_features = word_vectorizer.transform([cleaned_new_resume])
    predicted_category = clf.predict(new_resume_features)
    predicted_category_name = le.inverse_transform([predicted_category])
    
    return predicted_category_name[0]

