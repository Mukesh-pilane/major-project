import re
import fitz  # PyMuPDF
import pickle

def extract_text_from_pdf(pdf_path):
    """
    Extracts text content from a PDF file.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        str: Extracted text from the PDF.
    """
    text = ""
    pdf_document = fitz.open(pdf_path)
    
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")
    
    pdf_document.close()
    return text

def clean_resume(resume_text):
    """
    Cleans a resume text by removing unwanted elements.

    Args:
        resume_text (str): Input resume text.

    Returns:
        str: Cleaned resume text.
    """
    resume_text = re.sub('http\S+\s*', ' ', resume_text)
    resume_text = re.sub('RT|cc', ' ', resume_text)
    resume_text = re.sub('#\S+', '', resume_text)
    resume_text = re.sub('@\S+', '  ', resume_text)
    resume_text = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', resume_text)
    resume_text = re.sub(r'[^\x00-\x7f]', r' ', resume_text)
    resume_text = re.sub('\s+', ' ', resume_text)
    return resume_text

def predict_resume_category(pdf_path, model_path='../dumped_data/resume_classifier_model.pkl', vectorizer_path='../dumped_data/resume_classifier_tfidf_vectorizer.pkl', encoder_path='../dumped_data/resume_classifier_label_encoder.pkl'):
    """
    Predicts the category of a resume from a PDF file.

    Args:
        pdf_path (str): Path to the PDF file containing the resume.
        model_path (str): Path to the trained model file.
        vectorizer_path (str): Path to the TF-IDF vectorizer file.
        encoder_path (str): Path to the LabelEncoder file.

    Returns:
        str: Predicted category name.
    """
    
    # Load the LabelEncoder
    with open(encoder_path, 'rb') as encoder_file:
        le = pickle.load(encoder_file)

    # Load the trained model
    with open(model_path, 'rb') as model_file:
        clf = pickle.load(model_file)

    # Load the TF-IDF vectorizer
    with open(vectorizer_path, 'rb') as vectorizer_file:
        word_vectorizer = pickle.load(vectorizer_file)
    
    # Extract text from the PDF
    extracted_text = extract_text_from_pdf(pdf_path)
    
    # Clean the new resume text
    cleaned_new_resume = clean_resume(extracted_text)
    
    # Vectorize the cleaned new resume text
    new_resume_features = word_vectorizer.transform([cleaned_new_resume])
    
    # Make a prediction using the trained classifier
    predicted_category = clf.predict(new_resume_features)
    
    # Inverse transform the predicted label to get the original category name
    predicted_category_name = le.inverse_transform([predicted_category])
    
    return predicted_category_name[0]

# Replace 'Mukesh.pdf' with the actual path to your PDF file
pdf_path = '../dumped_data/Mukesh.pdf'
predicted_category = predict_resume_category(pdf_path)
print("Predicted Category:", predicted_category)
