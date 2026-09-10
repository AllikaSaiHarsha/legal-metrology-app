import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currentUser } from '../services/api';

export default function ProfileScreen({ navigation }: any) {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.33.203.29:3000/api/db/users')
      .then(res => res.json())
      .then(data => {
        setTeam(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching team:', err);
        setLoading(false);
      });
  }, []);

  return (
    <LinearGradient
      colors={['#1e1b4b', '#09090b', '#09090b']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Inspector Profile</Text>
            <TouchableOpacity onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); navigation.replace('LoginScreen'); }}>
              <Feather name="log-out" size={24} color="#f87171" />
            </TouchableOpacity>
          </View>

          <BlurView intensity={80} tint="dark" style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${currentUser?.name || 'Inspector'}` }} 
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>{currentUser?.name || 'Unknown User'}</Text>
            <Text style={styles.role}>{currentUser?.role || 'Inspector'}</Text>
            <Text style={styles.department}>Govt. of India • Region 4</Text>
          </BlurView>

          <Text style={styles.sectionTitle}>Performance Stats</Text>
          
          <View style={styles.statsRow}>
            <BlurView intensity={80} tint="dark" style={[styles.statCard, { marginRight: 8 }]}>
              <Feather name="activity" size={24} color="#818cf8" style={styles.statIcon} />
              <Text style={styles.statValue}>1,204</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </BlurView>
            
            <BlurView intensity={80} tint="dark" style={[styles.statCard, { marginLeft: 8 }]}>
              <Feather name="alert-triangle" size={24} color="#f87171" style={styles.statIcon} />
              <Text style={styles.statValue}>84</Text>
              <Text style={styles.statLabel}>Violations Found</Text>
            </BlurView>
          </View>

          <Text style={styles.sectionTitle}>Account Details</Text>

          <BlurView intensity={80} tint="dark" style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Feather name="mail" size={18} color="#a1a1aa" style={styles.detailIcon} />
              <Text style={styles.detailText}>{currentUser?.email || 'No email provided'}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Feather name="phone" size={18} color="#a1a1aa" style={styles.detailIcon} />
              <Text style={styles.detailText}>+91 98765 43210</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Feather name="map-pin" size={18} color="#a1a1aa" style={styles.detailIcon} />
              <Text style={styles.detailText}>Hyderabad District Office</Text>
            </View>
          </BlurView>

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Team Directory</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#818cf8" />
              <Text style={styles.loadingText}>Loading team...</Text>
            </View>
          ) : (
            <View style={styles.teamContainer}>
              {team.map((user, index) => (
                <BlurView key={user.id || index} intensity={80} tint="dark" style={styles.teamCard}>
                  <View style={styles.teamAvatar}>
                    <Text style={styles.teamAvatarText}>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{user.name}</Text>
                    <Text style={styles.teamEmail}>{user.email}</Text>
                  </View>
                  <View style={[styles.roleBadge, { backgroundColor: user.role === 'admin' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(129, 140, 248, 0.1)' }]}>
                    <Text style={[styles.roleText, { color: user.role === 'admin' ? '#fca5a5' : '#818cf8' }]}>
                      {user.role?.toUpperCase()}
                    </Text>
                  </View>
                </BlurView>
              ))}
            </View>
          )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileCard: {
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#818cf8',
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#818cf8',
    fontWeight: '600',
    marginBottom: 4,
  },
  department: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  detailsCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailText: {
    fontSize: 16,
    color: '#e4e4e7',
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
  },
  teamContainer: {
    marginTop: 8,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(129, 140, 248, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teamAvatarText: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '700',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  teamEmail: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#a1a1aa',
    marginLeft: 8,
  }
});
