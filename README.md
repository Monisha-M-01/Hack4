# SahayataSetu (सहायता सेतु / ಸಹಾಯ ಸೇತು)

> **Bridging the Last Mile of Indian Civic Welfare through Accessible, Multilingual Digital Public Infrastructure.**

---

## 💡 The Vision & The Problem

India has some of the world's most progressive social welfare initiatives — from income support like **PM-KISAN** and healthcare coverage like **Ayushman Bharat**, to old-age pensions and female head-of-household grants like **Gruha Lakshmi**. 

Yet, millions of eligible citizens miss out on life-changing benefits every year. The bottleneck is rarely the policy; it is the **last-mile delivery interface**:
- **Linguistic Exclusion & Bureaucratic Jargon:** Official portals often rely on complex legalistic terminology in English or standardized Hindi, leaving non-English speakers and rural citizens stranded.
- **Eligibility Blindspots:** Citizens rarely know which schemes match their exact profile without paying middlemen or making repeated trips to administrative offices.
- **Fragile Document Uploads:** Rigid file requirements frequently reject mobile uploads due to minor lighting issues, blurry scans, or size constraints, offering no guidance on how to fix them.
- **The "Black Box" of Welfare Applications:** Once an application is submitted, applicants are left in the dark for weeks or months, unsure whether their application was received, where it is stuck, or if action is needed.

---

## 🌉 What is SahayataSetu?

**SahayataSetu** (*The Assistance Bridge*) is a mobile-first, civic-tech web application designed to democratize access to government welfare schemes across India. Built strictly with **Google Material Design 3 (M3)** principles and Indian Digital Public Infrastructure (DPI) sensibilities, SahayataSetu transforms bureaucratic hurdles into an intuitive, empowering experience for every Indian citizen.

---

## 🏛️ Core Pillars of the Platform

### 1. Truly Native, Everyday Multilingualism
SahayataSetu is crafted from the ground up to speak the language of everyday citizens:
- **Conversational i18n:** Full, natural localization across **English**, **हिन्दी (Hindi)**, and **ಕನ್ನಡ (Kannada)** that avoids cold bureaucratic terminology.
- **Script-Safe Typography:** Enforces a dedicated relaxed line-height (`1.65`) across Devanagari and Kannada fonts (*Noto Sans Devanagari* and *Noto Sans Kannada*) to guarantee that upper and lower vowel markers (*matras*) never clip.
- **Voice & Accessibility First:** Features an integrated **Audio Read-Aloud engine** (Web Speech API) calibrated to regional Indian accents (`hi-IN`, `kn-IN`, `en-IN`) and an instant **A / A+ Text Scaling Toggle** that switches seamlessly between 16px and 20px without layout distortion.

### 2. Transparent, Human-Centered Eligibility Engine
Instead of expecting citizens to navigate hundreds of complex policy clauses, SahayataSetu asks four straightforward household questions:
- Age bracket, annual household income, primary occupation, and ration card status.
- A client-side, pure rule evaluation engine instantly matches the applicant's profile against welfare schemes, clearly communicating **why they qualify** in plain language or **what specific criterion was unmet** — eliminating ambiguity and protecting citizen dignity.

### 3. Smart & Forgiving Document Verification
Recognizing the diverse technological realities of Indian households, the platform supports two realistic verification pathways for mandatory identity and scheme documents:
- **1-Tap DigiLocker Integration:** Direct digital retrieval simulated through authenticated government DPI rails.
- **Camera & Photo Capture:** Native camera support with real-time client-side validation.
- **Resilient Error Recovery:** Rather than flatly rejecting uploads, the system provides constructive, polite guidance — detecting oversized files or blurry photographs and offering clear, one-tap retake mechanisms.

### 4. End-to-End Delivery-Style Status Tracking
SahayataSetu replaces the bureaucratic black box with a transparent, 4-stage tracking timeline modeled after modern delivery apps:
- Tracks application progress through **Submission**, **Taluk/Panchayat Verification**, **Officer Approval**, and **Direct Benefit Transfer (DBT)** disbursement.
- **Action Needed Resolution:** If an issue arises (such as an unclear document image), the interface highlights the exact stage with an actionable alert, allowing the citizen to fix and re-upload the document inline before administrative deadlines expire.
- **Receipt & Proof:** Instant application ID generation with single-tap clipboard copy, WhatsApp/SMS receipt dispatch simulation, and dedicated toll-free helpline support.

### 5. Resilient Offline-First Architecture
Built for low-connectivity environments and slow 3G networks:
- Automatic local state persistence across sessions.
- An integrated offline mode that reassures users their application data remains safe on their device even when network connectivity drops.

---

## 🎨 Civic Design Language (Material Design 3)

The design strictly follows Google Material Design 3 (M3) with a purpose-built **Indian Civic DPI Palette**:
- **Surfaces:** Clean, warm tonal backgrounds (`#F7F9FC`) and elevated container tiers (`#EFF3F8`, `#E2E8F0`) that replace heavy shadows with accessible tonal hierarchy.
- **Colors:** Authoritative Primary Navy (`#16325C`), Action Teal (`#0F766E`), Verified Green (`#15803D`), Amber Alert (`#B45309`), and Error Container (`#FFDAD6` / `#410002`).
- **Touch Ergonomics:** Generous `min-h-12` (48dp) `rounded-full` buttons, tactile press states (`active:scale-[0.98]`), and `rounded-2xl` tonal cards designed for one-handed thumb navigation on mobile screens.

---

## 🛠️ Technology Stack

- **Frontend Core:** React 19, Vite 8
- **Styling & Design System:** Tailwind CSS v4 (@tailwindcss/vite) configured with custom Material Design 3 design tokens
- **Icons:** Lucide React
- **Typography:** Google Fonts (*Plus Jakarta Sans*, *Noto Sans Devanagari*, *Noto Sans Kannada*)
- **State & Storage:** React Context API with synchronized `localStorage` persistence

---

## 🚀 Running the Project Locally

```bash
# Clone the repository
git clone https://github.com/Monisha-M-01/Hack4.git
cd Hack4

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

> On desktop screens, SahayataSetu renders inside a centered mobile shell with an accompanying **Judge Demo Controls** panel that allows reviewers to test offline mode, blurry photo errors, action-needed alerts, and timeline stage progression in real time.
