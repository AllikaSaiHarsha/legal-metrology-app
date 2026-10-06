# Legal Metrology Compliance Verification App

A full-stack web application prototype designed to streamline and automate Legal Metrology Rule compliance checks. The platform allows users to upload product labeling and packaging images, extracting critical information via OCR and computer vision to verify adherence to statutory packaging and metrology regulations.

---

## 🚀 Tech Stack

### **Frontend**
* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS

### **Backend & Processing**
* **API Framework:** Python [FastAPI](https://fastapi.tiangolo.com/)
* **Computer Vision & OCR:** OpenCV, Tesseract OCR

---

## ✨ Key Features

* **Image Upload Pipeline:** Seamless frontend-to-backend image transfer for packaging and label inspection.
* **Automated OCR Extraction:** Utilizes Tesseract OCR powered by OpenCV preprocessing routines to accurately parse text data (such as net quantity, manufacturer details, and pricing) from packaging labels.
* **Compliance Validation:** Automatically cross-references extracted data points against standard Legal Metrology guidelines.
* **Modern UI/UX:** Built with a responsive, clean interface optimized for fast verification workflows.

---

## 🛠️ Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* Python (v3.9+)
* Tesseract OCR installed on your system (ensure `tesseract` is added to your system PATH)

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AllikaSaiHarsha/legal-metrology-app.git](https://github.com/AllikaSaiHarsha/legal-metrology-app.git)
   cd legal-metrology-app
