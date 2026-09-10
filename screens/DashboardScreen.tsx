import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { fetchDashboardData } from '../services/api';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState({ total: 0, complianceRate: 0, activeViolations: 0, pendingAudits: 0 });
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          const data = await fetchDashboardData();
          if (isActive && data.inspections) {
            const inspections = data.inspections;
            
            // Calculate stats
            const total = inspections.length;
            const violationsCount = data.violations ? data.violations.filter((v: any) => v.status === 'open').length : 0;
            const compliantCount = data.products ? data.products.filter((p: any) => p.complianceStatus === 'compliant').length : 0;
            const complianceRate = total > 0 ? Math.round((compliantCount / total) * 100) : 100;
            const pendingAudits = inspections.filter((i: any) => i.status === 'in-progress' || i.status === 'pending').length;

            setStats({ total, complianceRate, activeViolations: violationsCount, pendingAudits });
            setRecentScans(inspections.slice(0, 5)); // Top 5 recent
            setProducts(data.products || []);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchData();
      return () => { isActive = false; };
    }, [])
  );

  return (
    <LinearGradient
      colors={['#1e1b4b', '#09090b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="light" />
        
        {/* TopBar */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Executive Dashboard</Text>
            <Text style={styles.subtitle}>Real-time compliance overview</Text>
          </View>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          
          {/* Banner */}
          <BlurView intensity={60} tint="dark" style={styles.banner}>
            <View style={styles.bannerHeader}>
              <View style={styles.bannerIcon}>
                <Ionicons name="scan-outline" size={20} color="#818cf8" />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Ready to inspect a new product label?</Text>
                <Text style={styles.bannerSubtitle}>
                  Upload package photos for automated Legal Metrology Rule 2011 compliance checks.
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('Scanner'); }}
            >
              <Ionicons name="scan" size={16} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Go to Live Scanner</Text>
            </TouchableOpacity>
          </BlurView>

          {/* KPI Cards */}
          <View style={styles.kpiGrid}>
            <BlurView intensity={60} tint="dark" style={[styles.kpiCard, styles.kpiCardLeft]}>
              <View style={styles.kpiHeader}>
                <Feather name="clipboard" size={20} color="#818cf8" />
                <View style={[styles.trendBadge, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                  <Feather name="trending-up" size={12} color="#a5b4fc" />
                  <Text style={[styles.trendText, { color: '#a5b4fc' }]}>+12%</Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{loading ? '...' : stats.total}</Text>
              <Text style={styles.kpiTitle}>Total Inspections</Text>
            </BlurView>

            <BlurView intensity={60} tint="dark" style={[styles.kpiCard, styles.kpiCardRight]}>
              <View style={styles.kpiHeader}>
                <Feather name="shield" size={20} color="#34d399" />
                <View style={[styles.trendBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Feather name="trending-up" size={12} color="#6ee7b7" />
                  <Text style={[styles.trendText, { color: '#6ee7b7' }]}>+2.4%</Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{loading ? '...' : `${stats.complianceRate}%`}</Text>
              <Text style={styles.kpiTitle}>Compliance Rate</Text>
            </BlurView>
          </View>

          <View style={styles.kpiGrid}>
            <BlurView intensity={60} tint="dark" style={[styles.kpiCard, styles.kpiCardLeft]}>
              <View style={styles.kpiHeader}>
                <Feather name="alert-triangle" size={20} color="#fb7185" />
                <View style={[styles.trendBadge, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
                  <Feather name="trending-down" size={12} color="#fda4af" />
                  <Text style={[styles.trendText, { color: '#fda4af' }]}>-5%</Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{loading ? '...' : stats.activeViolations}</Text>
              <Text style={styles.kpiTitle}>Active Violations</Text>
            </BlurView>

            <BlurView intensity={60} tint="dark" style={[styles.kpiCard, styles.kpiCardRight]}>
              <View style={styles.kpiHeader}>
                <Feather name="clock" size={20} color="#fbbf24" />
                <View style={[styles.trendBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Feather name="trending-up" size={12} color="#fcd34d" />
                  <Text style={[styles.trendText, { color: '#fcd34d' }]}>+8</Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{loading ? '...' : stats.pendingAudits}</Text>
              <Text style={styles.kpiTitle}>Pending Audits</Text>
            </BlurView>
          </View>

          {/* Recent Inspections */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="list" size={20} color="#fafafa" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Recent Inspections</Text>
            </View>
            
            <View style={styles.cardList}>
              {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#4f46e5" />
                </View>
              ) : recentScans.length > 0 ? (
                recentScans.map((scan) => {
                  const product = products.find(p => p.id === scan.productId);
                  return (
                    <BlurView intensity={60} tint="dark" key={scan.id} style={styles.listItem}>
                      <View style={styles.listItemHeader}>
                        <Text style={styles.listItemId}>{scan.id}</Text>
                        <View style={[styles.statusBadge, { 
                          backgroundColor: scan.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)' 
                        }]}>
                          <Text style={[styles.statusText, { 
                            color: scan.status === 'completed' ? '#6ee7b7' : '#fcd34d' 
                          }]}>
                            {scan.status}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.listItemTitle}>{product?.name || scan.location}</Text>
                      <View style={styles.listItemFooter}>
                        <Text style={styles.listItemSub}>{new Date(scan.date).toLocaleDateString()}</Text>
                        <Text style={[styles.complianceScore, { 
                          color: scan.complianceScore >= 80 ? '#6ee7b7' : '#fda4af' 
                        }]}>
                          {scan.complianceScore}% Score
                        </Text>
                      </View>
                    </BlurView>
                  );
                })
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#a1a1aa' }}>No recent inspections found.</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 2,
  },
  banner: {
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  bannerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginRight: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f4f4f5',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 18,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Apple frosted button
    borderRadius: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  kpiGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  kpiCardLeft: {
    marginRight: 8,
  },
  kpiCardRight: {
    marginLeft: 8,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 13,
    color: '#a1a1aa',
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
  },
  cardList: {
    gap: 12,
  },
  listItem: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#818cf8', // indigo-400
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e4e4e7', // zinc-200
    marginBottom: 12,
  },
  listItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemSub: {
    fontSize: 13,
    color: '#a1a1aa',
  },
  complianceScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
