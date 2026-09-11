// Note: Replace with your actual machine's local IP address if running on a physical device
// Use 10.0.2.2 for Android Emulator, or localhost/127.0.0.1 for iOS simulator.
export const BACKEND_API_URL = 'https://legal-metrology-backend-dhto.onrender.com/api/v1'; // Render Cloud AI
export const WEB_DASHBOARD_API_URL = 'https://legal-metrology-web.vercel.app/api/db/inspections'; // Next.js Cloud App

export interface Detection {
  category: string;
  label: string;
  status: 'Passed' | 'Failed' | string;
  box: { x: number; y: number; width: number; height: number };
}

export interface AnalysisResult {
  product_name: string;
  manufacturer: string;
  filename: string;
  original_width: number;
  original_height: number;
  detections: Detection[];
  image_url: string;
}

import { uploadAsync } from 'expo-file-system/legacy';

export const analyzeImage = async (imageUri: string, fileName: string = 'scan.jpg'): Promise<AnalysisResult> => {
  try {
    const response = await uploadAsync(`${BACKEND_API_URL}/analyze`, imageUri, {
      fieldName: 'file',
      httpMethod: 'POST',
      uploadType: 1, // FileSystemUploadType.MULTIPART
      mimeType: 'image/jpeg',
    });

    if (response.status !== 200) {
      throw new Error(`Failed to analyze image: HTTP ${response.status}\n${response.body}`);
    }

    return JSON.parse(response.body);
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const syncToWebDashboard = async (analysisData: AnalysisResult) => {
  // Construct the payload to match what the Next.js API expects
  
  // Generate unique IDs using timestamp and random string to prevent collisions
  const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  const inspectionId = `INS-MOB-${uniqueSuffix}`;
  const productId = `PRD-MOB-${uniqueSuffix}`;

  let passedCount = 0;
  let failedCount = 0;
  const violations: any[] = [];
  
  // Extract values
  let detectedMrp = 0;
  let detectedNetQty = "Not Declared";
  let detectedMfgDate = new Date().toISOString().split("T")[0];
  let detectedExpDate = "Not Declared";

  analysisData.detections.forEach((det, idx) => {
    const isPassed = det.status === "Passed";
    const isFailed = det.status === "Failed";

    if (isPassed) passedCount++;
    if (isFailed) failedCount++;

    const category = det.category || "General";
    
    if (category === "MRP") {
      const priceMatch = det.label.match(/(?:Rs\.?|₹|INR)?\s*(\d+(?:\.\d{1,2})?)/i);
      if (priceMatch) detectedMrp = parseFloat(priceMatch[1]);
    } else if (category === "Net Weight") {
      const qtyMatch = det.label.match(/(\d+(?:\.\d+)?\s*(?:g|gm|gms|kg|ml|l|ltr|cc|pieces|units|n))/i);
      if (qtyMatch) detectedNetQty = qtyMatch[1];
    } else if (category === "Manufacture Date") {
      const mfgMatch = det.label.match(/(\d{1,2}[./\-]\d{1,2}[./\-]\d{2,4}|\d{1,2}[./\-]\d{2,4}|[A-Za-z]{3,9}\s*\d{2,4})/i);
      if (mfgMatch) detectedMfgDate = mfgMatch[1];
    } else if (category === "Expire Date") {
      const expMatch = det.label.match(/(\d{1,2}[./\-]\d{1,2}[./\-]\d{2,4}|\d+\s*Months?(?:\s*from\s*mfg)?)/i);
      if (expMatch) detectedExpDate = expMatch[1];
    }

    if (isFailed) {
      violations.push({
        id: `VIO-MOB-${uniqueSuffix}-${idx + 1}`,
        ruleCode: `LM-R6(1)`, // Simplified for mobile
        ruleTitle: `${category} Statutory Non-Compliance`,
        description: det.label,
        severity: category === "MRP" || category === "Net Weight" ? "critical" : "major",
        remediation: "Correct package printing to conform to Rule 6",
        status: "open",
      });
    }
  });

  const totalDetections = analysisData.detections.length;
  const complianceScore = totalDetections > 0 ? Math.round((passedCount / totalDetections) * 100) : 80;
  const isCompliant = failedCount === 0 && passedCount >= 3;

  const payload = {
    inspection: {
      id: inspectionId,
      inspector: "Mobile Inspector",
      date: new Date().toISOString().split("T")[0],
      location: "Field Scan",
      status: "completed",
      imageUrl: analysisData.image_url || "",
      complianceScore: complianceScore,
      detections: analysisData.detections
    },
    product: {
      id: productId,
      name: analysisData.product_name || "Scanned Mobile Commodity",
      category: "Packaged Commodity",
      manufacturer: analysisData.manufacturer || "Unknown (Mobile Scan)",
      mfgDate: detectedMfgDate,
      expiryDate: detectedExpDate,
      batchNo: `LOT-${new Date().getFullYear()}-${uniqueSuffix.substring(0, 5)}`,
      netQuantity: detectedNetQty,
      mrp: detectedMrp || 99,
      complianceStatus: isCompliant ? "compliant" : "non-compliant",
    },
    violations
  };

  try {
    const response = await fetch(WEB_DASHBOARD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync to dashboard: ${response.statusText}`);
    }
    
    // Invalidate cache after successful sync
    dashboardCache = null;

    return await response.json();
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
};

// Simple global cache for fetching history to make screen transitions blazing fast
let dashboardCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10000; // 10 seconds

export const fetchDashboardData = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && dashboardCache && (now - lastFetchTime < CACHE_DURATION)) {
    return dashboardCache;
  }

  try {
    const res = await fetch(WEB_DASHBOARD_API_URL);
    const data = await res.json();
    dashboardCache = data;
    lastFetchTime = now;
    return data;
  } catch (error) {
    if (dashboardCache) return dashboardCache; // Fallback to stale cache if offline
    throw error;
  }
};

// Global Auth State with AsyncStorage persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@legal_metrology_user';

export let currentUser = {
  name: "Anil Kumar",
  email: "anil.kumar@metrology.gov.in",
  role: "Senior Metrology Inspector",
};

export const setCurrentUser = async (user: any) => {
  currentUser = { ...currentUser, ...user };
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
  } catch (e) {
    console.error('Failed to save user session:', e);
  }
};

export const loadSavedUser = async (): Promise<boolean> => {
  try {
    const saved = await AsyncStorage.getItem(AUTH_KEY);
    if (saved) {
      currentUser = JSON.parse(saved);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to load user session:', e);
    return false;
  }
};

export const clearCurrentUser = async () => {
  currentUser = { name: "", email: "", role: "" };
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.error('Failed to clear user session:', e);
  }
};
