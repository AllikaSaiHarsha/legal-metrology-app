# Legal Metrology Mobile Inspector 📱📦

Cross-platform mobile inspection application built with **React Native** & **Expo SDK 52** for field enforcement audits under the **Legal Metrology (Packaged Commodities) Rules, 2011 (Rule 6)**.

---

## 🚀 True Architecture & Tech Stack

Contrary to web templates, this repository contains the **native mobile inspection app** designed for on-site field officers. It connects directly to the FastAPI cloud backend, utilizing **Google Gemini Multimodal Vision AI** for instant optical text extraction and compliance evaluation:

* **Framework:** [React Native](https://reactnative.dev/) with [Expo SDK 52](https://expo.dev/)
* **Navigation:** React Navigation (Native Stack + Floating Glassmorphic Tab Bar)
* **OTA Distribution:** Expo Application Services (EAS) Over-The-Air updates (`preview` channel)
* **Camera & Media Ingestion:** `expo-image-picker` with native permissions handling
* **Tactile Haptics:** `expo-haptics` (tactile shutter clicks, double-pulse validation confirmation)
* **Styling & Components:** Expo Linear Gradient, React Bits dark theme components

---

## ✨ Core Features

* **Live Label Capture:** High-resolution label photography with real-time statutory rule inspection.
* **Instant Cloud Sync:** Audits taken on mobile are processed by the FastAPI backend and instantly mirrored to the executive Next.js web dashboard.
* **Over-The-Air (OTA) Updates:** Allows instantaneous bug fixes and feature deployments pushed directly to inspectors' devices without reinstalling the APK.
* **Rule 6 Statutory Breakdown:** Visual pass/fail status badges for MRP, USP, Net Weight, Manufacturer, and Consumer Grievance markings.

---

## 🛠️ Local Development & Running

### Prerequisites
* Node.js 18.18+ or 20+
* Expo Go app or an Android development build

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AllikaSaiHarsha/legal-metrology-app.git
   cd legal-metrology-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Publish an Over-The-Air Update:**
   ```bash
   eas update --channel preview --message "Your release note"
   ```
