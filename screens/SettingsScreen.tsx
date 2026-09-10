import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [savePhotos, setSavePhotos] = useState(true);

  return (
    <LinearGradient
      colors={['#1e1b4b', '#09090b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>App Settings</Text>
          </View>

          <Text style={styles.sectionTitle}>Preferences</Text>

          <BlurView intensity={80} tint="dark" style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="smartphone" size={20} color="#ffffff" style={styles.settingIcon} />
                <Text style={styles.settingText}>Haptic Feedback</Text>
              </View>
              <Switch 
                value={hapticsEnabled} 
                onValueChange={(v) => { Haptics.selectionAsync(); setHapticsEnabled(v); }}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#818cf8' }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="volume-2" size={20} color="#ffffff" style={styles.settingIcon} />
                <Text style={styles.settingText}>Scan Sounds</Text>
              </View>
              <Switch 
                value={soundEnabled} 
                onValueChange={(v) => { Haptics.selectionAsync(); setSoundEnabled(v); }}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#818cf8' }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Feather name="image" size={20} color="#ffffff" style={styles.settingIcon} />
                <Text style={styles.settingText}>Save Scans to Gallery</Text>
              </View>
              <Switch 
                value={savePhotos} 
                onValueChange={(v) => { Haptics.selectionAsync(); setSavePhotos(v); }}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#818cf8' }}
                thumbColor="#ffffff"
              />
            </View>
          </BlurView>

          <Text style={styles.sectionTitle}>Support & About</Text>

          <BlurView intensity={80} tint="dark" style={styles.settingsCard}>
            <TouchableOpacity style={styles.linkRow}>
              <View style={styles.settingInfo}>
                <Feather name="help-circle" size={20} color="#a1a1aa" style={styles.settingIcon} />
                <Text style={styles.linkText}>Help Center & Guidelines</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#a1a1aa" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.linkRow}>
              <View style={styles.settingInfo}>
                <Feather name="file-text" size={20} color="#a1a1aa" style={styles.settingIcon} />
                <Text style={styles.linkText}>Terms of Service</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#a1a1aa" />
            </TouchableOpacity>
          </BlurView>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Legal Metrology App v1.0.4</Text>
            <Text style={styles.versionText}>Liquid Glass Edition</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for nav bar
  },
  header: {
    marginBottom: 24,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 12,
  },
  settingsCard: {
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginBottom: 32,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#e4e4e7',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    color: '#71717a',
    fontSize: 12,
    marginBottom: 4,
  }
});
