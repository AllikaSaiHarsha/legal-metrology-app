# Legal Metrology Mobile Field Scanner 📱📦

[![Mobile App CI](https://github.com/AllikaSaiHarsha/legal-metrology-app/actions/workflows/ci.yml/badge.svg)](https://github.com/AllikaSaiHarsha/legal-metrology-app/actions/workflows/ci.yml)
[![React Native](https://img.shields.io/badge/React_Native-0.86-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> 📦 **Legal Metrology Vision Ecosystem**  
> 📱 [Mobile Field Scanner App](https://github.com/AllikaSaiHarsha/legal-metrology-app) • 💻 [Web Command Center](https://github.com/AllikaSaiHarsha/legal-metrology-web) • 🧠 [AI Vision Backend](https://github.com/AllikaSaiHarsha/legal-metrology-backend)

Cross-platform mobile inspection application built with **React Native** & **Expo SDK 57** for field enforcement officers auditing **Rule 6 packaging compliance** under the Legal Metrology (Packaged Commodities) Rules, 2011.

---

## 🚀 Architecture & Tech Stack

This native mobile inspection app is designed for on-site field officers. It connects directly to the FastAPI cloud backend, utilizing **Google Gemini Multimodal Vision AI** for optical extraction and statutory compliance validation:

* **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 57)
* **Navigation:** React Navigation (Native Stack + Floating Glassmorphic Tab Bar)
* **OTA Distribution & Builds:** Expo Application Services (EAS) with Over-The-Air updates
* **Camera & Media Ingestion:** `expo-image-picker` with native permissions handling
* **Tactile Haptics:** `expo-haptics` (tactile shutter clicks, double-pulse validation feedback)
* **Styling & Components:** Expo Linear Gradient, React Native Reanimated, Expo Blur, Lucide icons

---

## ✨ Core Features

* **Field Label Capture:** High-resolution label photography with real-time statutory rule inspection.
* **Instant Cloud Sync:** Audits taken on mobile are processed by the FastAPI backend and instantly mirrored to the executive Next.js web dashboard.
* **Over-The-Air (OTA) Updates:** Allows instantaneous updates pushed directly to inspectors' devices without manual APK updates.
* **Rule 6 Statutory Breakdown:** Visual pass/fail status badges for MRP, USP, Net Weight, Manufacturer, and Consumer Grievance markings.

---

## 🛠️ Local Development & Running

### Prerequisites
* Node.js 18.18+ or 20+
* Expo Go app on a physical device, or an Android/iOS emulator

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

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Update EXPO_PUBLIC_API_URL to point to your FastAPI server
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

5. **Typecheck:**
   ```bash
   npm run typecheck
   ```

6. **Build Standalone Android APK:**
   ```bash
   eas build -p android --profile preview
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
