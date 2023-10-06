import re
import pickle

def extract_text_from_pdf(pdf_document):
    text = ""
    
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")
    
    pdf_document.close()
    return text

def clean_resume(resume_text):
    resume_text = re.sub('http\S+\s*', ' ', resume_text)
    resume_text = re.sub('RT|cc', ' ', resume_text)
    resume_text = re.sub('#\S+', '', resume_text)
    resume_text = re.sub('@\S+', '  ', resume_text)
    resume_text = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', resume_text)
    resume_text = re.sub(r'[^\x00-\x7f]', r' ', resume_text)
    resume_text = re.sub('\s+', ' ', resume_text)
    return resume_text

def predict_resume_category(pdf_document, model_path='../dumped_data/resume_classifier_model.pkl', vectorizer_path='../dumped_data/resume_classifier_tfidf_vectorizer.pkl', encoder_path='../dumped_data/resume_classifier_label_encoder.pkl'):
    with open(encoder_path, 'rb') as encoder_file:
        le = pickle.load(encoder_file)

    with open(model_path, 'rb') as model_file:
        clf = pickle.load(model_file)

    with open(vectorizer_path, 'rb') as vectorizer_file:
        word_vectorizer = pickle.load(vectorizer_file)
    
    extracted_text = extract_text_from_pdf(pdf_document)
    cleaned_new_resume = clean_resume(extracted_text)
    new_resume_features = word_vectorizer.transform([cleaned_new_resume])
    predicted_category = clf.predict(new_resume_features)
    predicted_category_name = le.inverse_transform([predicted_category])
    
    return predicted_category_name[0]

# pdf_path = '../dumped_data/Mukesh.pdf'
# predicted_category = predict_resume_category(pdf_path)
# print("Predicted Category:", predicted_category)
