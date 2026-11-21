# SahayataSetu (सहायता सेतु / ಸಹಾಯ ಸೇತು)

> An accessible, mobile-first web app that helps citizens easily find, apply for, and track Indian government welfare schemes in their own language.

---

## 📌 About the Project

Applying for government welfare in India is often hindered by complex legal language, unclear eligibility rules, and lack of application tracking. 

**SahayataSetu** bridges this gap by acting as a simplified civic front-end:
- **Speaks Your Language:** Fully available in everyday Hindi, Kannada, and English with audio read-aloud support and large-text mode.
- **Instant Eligibility Check:** Answer 4 simple questions (age, income, occupation, ration card) to see exactly which schemes you qualify for and why.
- **Smart Document Upload:** Fetch verified records in 1 tap via DigiLocker or take a camera photo, with helpful guidance if a photo is blurry.
- **Live Status Tracker:** Track your application step-by-step from submission to Direct Benefit Transfer (DBT) directly into your bank account.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 8
- **Design:** Tailwind CSS v4, Google Material Design 3 (M3)
- **Icons & Fonts:** Lucide React, Google Fonts (*Plus Jakarta Sans*, *Noto Sans Devanagari*, *Noto Sans Kannada*)
- **State & Storage:** React Context API + LocalStorage

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Monisha-M-01/Hack4.git
cd Hack4

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.  
*(On desktop, a demo control panel appears alongside the mobile frame to test offline mode, blurry photo errors, and stage progression).*
