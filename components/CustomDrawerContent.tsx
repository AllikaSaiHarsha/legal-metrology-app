import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props: any) {
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Inspector' }} 
            style={styles.avatar} 
          />
        </View>
        <Text style={styles.name}>Inspector Rajesh</Text>
        <Text style={styles.role}>Legal Metrology Officer</Text>
        <Text style={styles.badge}>Region: MH-04</Text>
      </View>

      <View style={styles.divider} />

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Feather name="log-out" size={20} color="#fb7185" />
          <Text style={styles.footerText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>v2.1.0-alpha</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b', // zinc-900
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#09090b', // zinc-950
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.2)', // indigo-500/20
    borderWidth: 2,
    borderColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  role: {
    color: '#a1a1aa',
    fontSize: 14,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '600',
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    color: '#fb7185',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  version: {
    color: '#52525b',
    fontSize: 12,
    textAlign: 'center',
  },
});
