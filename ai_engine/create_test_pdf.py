from pypdf import PdfWriter
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def create_dummy_pdf(filename):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, "John Doe")
    c.drawString(100, 730, "Software Engineer")
    c.drawString(100, 710, "Skills: Python, FastAPI, React, Node.js")
    c.drawString(100, 690, "Experience: 5 years of experience in building web applications.")
    c.save()
    
    buffer.seek(0)
    with open(filename, "wb") as f:
        f.write(buffer.read())

if __name__ == "__main__":
    create_dummy_pdf("test_resume.pdf")
