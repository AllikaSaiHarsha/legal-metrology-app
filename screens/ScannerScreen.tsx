import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView, Modal } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { analyzeImage, syncToWebDashboard, AnalysisResult } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function ScannerScreen() {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<AnalysisResult | null>(null);
  const [scannedImageUri, setScannedImageUri] = useState<string | null>(null);

  const handleScan = async (source: 'camera' | 'gallery') => {
    // Heavy thunk for camera (shutter feel), light tap for gallery
    Haptics.impactAsync(source === 'camera' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
    try {
      let result;

      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission Required", "Camera permission is required to scan labels.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission Required", "Photo library permission is required to upload labels.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsScanning(true);
        const imageUri = result.assets[0].uri;
        setScannedImageUri(imageUri);
        setLastScanResult(null); // clear old result
        
        // 1. Send to Python Backend for OCR/AI analysis
        console.log("Analyzing image...");
        const analysisData = await analyzeImage(imageUri);
        setLastScanResult(analysisData);

        // 2. Sync results to Next.js Web Dashboard
        console.log("Syncing to dashboard...");
        await syncToWebDashboard(analysisData);

        Alert.alert(
          "Scan Complete", 
          `Successfully scanned and synced to dashboard!\n\nProduct: ${analysisData.product_name || 'Unknown'}\nCompliance: ${analysisData.detections.filter(d => d.status === 'Passed').length}/${analysisData.detections.length} Passed`
        );
        // Double-pulse success: impact + notification for a premium "cha-ching" feel
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 150);
      }
    } catch (error: any) {
      console.error(error);
      // Triple-buzz error pattern
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
      Alert.alert("Scan Failed", error.message || "An error occurred during scanning or syncing.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1e1b4b', '#09090b', '#09090b']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fafafa" />
          </TouchableOpacity>
          <Text style={styles.title}>Live Inspector</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          
          {!scannedImageUri && !isScanning && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="camera-outline" size={48} color="#818cf8" />
              </View>
              <Text style={styles.emptyTitle}>Capture Product Label</Text>
              <Text style={styles.emptySubtitle}>
                Take a clear photo of the product packaging to automatically verify Legal Metrology compliance.
              </Text>
            </View>
          )}

          {scannedImageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: scannedImageUri }} style={styles.previewImage} />
            </View>
          )}

          {lastScanResult && !isScanning && (
            <BlurView intensity={60} tint="dark" style={styles.resultCard}>
              <Text style={styles.resultTitle}>{lastScanResult.product_name || "Unknown Product"}</Text>
              <Text style={styles.resultSubtitle}>{lastScanResult.manufacturer || "Unknown Manufacturer"}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {lastScanResult.detections.filter(d => d.status === 'Passed').length}/{lastScanResult.detections.length}
                  </Text>
                  <Text style={styles.statLabel}>Passed Rules</Text>
                </View>
              </View>

              <View style={styles.detectionsList}>
                {lastScanResult.detections.map((det, idx) => (
                  <View key={idx} style={styles.detectionRow}>
                    <View style={styles.detectionInfo}>
                      <Text style={styles.detectionCategory}>{det.category}</Text>
                      <Text style={styles.detectionText}>{det.label}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge, 
                      det.status === 'Passed' ? styles.badgePassed : styles.badgeFailed
                    ]}>
                      <Text style={[
                        styles.statusText,
                        det.status === 'Passed' ? styles.textPassed : styles.textFailed
                      ]}>{det.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </BlurView>
          )}

        </ScrollView>

        <BlurView intensity={60} tint="dark" style={styles.bottomBar}>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.primaryButton, isScanning && { opacity: 0.7 }]} 
              onPress={() => handleScan('camera')}
              disabled={isScanning}
            >
              <Ionicons name="camera" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>
                {scannedImageUri ? "Retake" : "Camera"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryButton, isScanning && { opacity: 0.7 }]} 
              onPress={() => handleScan('gallery')}
              disabled={isScanning}
            >
              <Ionicons name="images" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.secondaryButtonText}>
                Upload
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Progress Pop-Up Modal */}
        <Modal visible={isScanning} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <BlurView intensity={60} tint="dark" style={styles.modalContent}>
              <ActivityIndicator size="large" color="#ffffff" style={{ marginBottom: 16 }} />
              <Text style={styles.modalTitle}>Analyzing Label...</Text>
              <Text style={styles.modalSubtitle}>Running AI Optical Character Recognition & syncing with the dashboard.</Text>
            </BlurView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fafafa',
    marginTop: 16,
    fontWeight: '600',
  },
  resultCard: {
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#818cf8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  detectionsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 16,
    gap: 12,
  },
  detectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 12,
  },
  detectionInfo: {
    flex: 1,
    paddingRight: 12,
  },
  detectionCategory: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 4,
  },
  detectionText: {
    fontSize: 14,
    color: '#e4e4e7',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePassed: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgeFailed: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textPassed: {
    color: '#34d399',
  },
  textFailed: {
    color: '#fb7185',
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 22,
  },
});
