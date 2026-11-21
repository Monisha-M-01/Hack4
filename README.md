# SahayataSetu (सहायता सेतु / ಸಹಾಯ ಸೇತು)

> **A Mobile-First Indian Civic Welfare Scheme Discovery & Application Platform**  
> Built with React, Vite, Tailwind CSS, and Google Material Design 3 (M3) design tokens.

---

## 🌟 Key Features

1. **Multilingual by Design (Full i18n)**:
   - Complete, natural conversational localization in **English**, **हिन्दी (Hindi)**, and **ಕನ್ನಡ (Kannada)**.
   - Zero hardcoded text or raw keys; instant language switching without state reset.
   - Text scaling toggle (`A` 16px / `A+` 20px) with `line-height: 1.65` globally for safe Indic script rendering.
   - Web Speech API integration (`speechSynthesis`) for screen read-aloud in Indian English, Hindi, and Kannada.

2. **Google Material Design 3 (M3) Civic UI**:
   - Tonal surface and color roles (Primary Navy `#16325C`, Secondary Teal `#0F766E`, Verified Green `#15803D`, Amber Warning `#B45309`, Error Container `#FFDAD6`).
   - M3 48dp (`min-h-12`) `rounded-full` touch targets and tactile active press feedback.
   - `rounded-2xl` tonal cards with soft container fills and subtle borders.
   - Linear progress indicators and high-contrast M3 Dark Snackbar (`#2E3135`) toast notifications.

3. **Stage 1: Citizen Onboarding**:
   - Accessible welcome screen with large language selection cards, 3-step visual summary, and application resume card.

4. **Stage 2: Eligibility Wizard & Rule Engine**:
   - 4-step progressive wizard (Age group, Annual family income, Occupation, Ration card category).
   - Pure rule evaluation engine matching against 4 authentic Indian schemes:
     - **PM-KISAN Samman Nidhi** (₹6,000 / year)
     - **Ayushman Bharat PM-JAY** (₹5 Lakh free health cover / year)
     - **Indira Gandhi National Old Age Pension** (₹1,000–₹2,000 / month)
     - **Gruha Lakshmi / Mahila Sahayata Grant** (₹2,000 / month direct transfer)
   - Detailed eligibility reasons, document previews, and a 0-match recoverable error state.

5. **Stage 3: Document Collection & Smart Upload**:
   - 1-Tap **Fetch from DigiLocker** (with 1.2s verification simulation).
   - Native **Camera / File Upload** with thumbnail preview and file size check.
   - Recoverable error handling for file size (>5MB), file type, and blurry photo detection (`forceBlurryError`).
   - Incomplete submission guard with remaining document counter chip.

6. **Stage 4: Application Confirmation & Live Status Tracker**:
   - Prominent M3 tracking ID card (`SS-2026-XXXXX`) with copy action and WhatsApp/SMS receipt delivery.
   - 4-stage delivery-style vertical progress timeline:
     - Stage 1: Application Submitted
     - Stage 2: Document Verification at Taluk Office (with interactive *Action Needed* inline recovery)
     - Stage 3: Officer Approval
     - Stage 4: Direct Benefit Transfer (DBT) to Bank Account
   - Stage 4 celebration card with transaction UTR reference and toll-free helpline support.

7. **Desktop-Only Judge Demo Controls Panel**:
   - Visible on `lg:` viewports alongside the centered mobile frame:
     - Toggle Offline / Slow 3G Mode (displays sticky amber banner)
     - Force Blurry Photo Error
     - Trigger "Action Needed" status
     - Advance Application Stage
     - Reset Entire Demo
     - Real-time diagnostic state monitors

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite) + Google Material Design 3 (M3)
- **Icons**: Lucide React
- **Fonts**: Plus Jakarta Sans, Noto Sans Devanagari, Noto Sans Kannada

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Monisha-M-01/Hack4.git
cd Hack4

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.
