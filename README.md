# Legal Metrology Mobile Inspector 📱📦

Cross-platform mobile inspection app built with **React Native** & **Expo SDK 52** for field audits under the **Legal Metrology (Packaged Commodities) Rules, 2011**.

---

## 🚀 Key Features

* **Instant Camera Capture & Photo Upload:** Uses `expo-image-picker` with high-resolution packaging capture.
* **Over-The-Air (OTA) Updates:** Seamless updates distributed via Expo Application Services (EAS) on the `preview` and `production` channels.
* **Realtime Sync with Web Dashboard:** Uploaded audits are processed by the FastAPI backend and synced directly to the Next.js executive dashboard.
* **Tactile Haptic Feedback:** Enhanced physical feel powered by `expo-haptics` for shutter clicks, upload feedback, and success pulses.

---

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Publish OTA Update with EAS:**
   ```bash
   eas update --channel preview --message "Your update description"
   ```
