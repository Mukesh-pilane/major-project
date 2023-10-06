def pdfTextExtractor(pdf_document):
    text = ""
    
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")
    pdf_document.close()
    return text