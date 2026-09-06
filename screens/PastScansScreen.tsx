import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchDashboardData } from '../services/api';

export default function PastScansScreen() {
  const [scans, setScans] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch from the live backend via cached function
  useEffect(() => {
    fetchDashboardData()
      .then(data => {
        setScans(data.inspections || []);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching past scans:', err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(scans.length / ITEMS_PER_PAGE);
  const paginatedScans = scans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderScanItem = ({ item }: { item: any }) => {
    const product = products.find(p => p.id === item.productId);
    
    // Determine status style
    const isCompliant = product?.complianceStatus === 'compliant' || item.complianceScore === 100;
    const statusColor = isCompliant ? '#4ade80' : '#f87171';
    const statusIcon = isCompliant ? 'check-circle' : 'x-circle';

    return (
      <BlurView intensity={80} tint="dark" style={styles.scanCard}>
        <View style={styles.scanHeader}>
          <Text style={styles.scanDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: isCompliant ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)' }]}>
            <Feather name={statusIcon} size={14} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {isCompliant ? 'Compliant' : 'Violation'}
            </Text>
          </View>
        </View>

        <Text style={styles.productName}>{product?.name || 'Packaged Commodity'}</Text>
        
        <Text style={styles.companyName}>
          <Feather name="briefcase" size={14} color="#a1a1aa" /> {product?.manufacturer || 'Manufacturer Details'}
        </Text>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            Net Qty: <Text style={styles.detailValue}>{product?.netQuantity || 'N/A'}</Text>
          </Text>
          <Text style={styles.detailText}>
            MRP: <Text style={styles.detailValue}>₹{product?.mrp || 'N/A'}</Text>
          </Text>
        </View>

        {!isCompliant && item.detections && item.detections.length > 0 && (
          <View style={styles.violationsContainer}>
            {item.detections.filter((d: any) => d.status !== 'Passed').map((v: any, idx: number) => (
              <Text key={idx} style={styles.violationText}>• {v.label || v.category}</Text>
            ))}
          </View>
        )}
      </BlurView>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          disabled={currentPage === 1}
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          <Feather name="chevron-left" size={20} color={currentPage === 1 ? 'rgba(255,255,255,0.3)' : '#ffffff'} />
        </TouchableOpacity>
        
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
        
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          <Feather name="chevron-right" size={20} color={currentPage === totalPages ? 'rgba(255,255,255,0.3)' : '#ffffff'} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#1e1b4b', '#09090b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Past Inspections</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#818cf8" />
            <Text style={styles.loadingText}>Syncing History...</Text>
          </View>
        ) : scans.length === 0 ? (
          <View style={styles.centerContainer}>
            <Feather name="inbox" size={48} color="#3f3f46" />
            <Text style={styles.emptyText}>No previous scans found.</Text>
          </View>
        ) : (
          <FlatList
            data={paginatedScans}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderScanItem}
            ListFooterComponent={renderPagination}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for the floating nav bar
  },
  scanCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanDate: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
    marginTop: 4,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#a1a1aa',
  },
  detailValue: {
    color: '#ffffff',
    fontWeight: '600',
  },
  violationsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(248, 113, 113, 0.2)',
  },
  violationText: {
    fontSize: 13,
    color: '#fca5a5',
    marginBottom: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a1a1aa',
    marginTop: 12,
    fontSize: 16,
  },
  emptyText: {
    color: '#71717a',
    marginTop: 16,
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButtonDisabled: {
    backgroundColor: 'transparent',
  },
  pageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  }
});
