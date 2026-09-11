import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { currentUser } from '../services/api';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40;
const TAB_WIDTH = TAB_BAR_WIDTH / 4;

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
      bounciness: 12,
      speed: 14,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <Animated.View 
          style={[
            styles.activeIndicator,
            { transform: [{ translateX }] }
          ]} 
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.selectionAsync();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: any = 'help-circle';
          if (route.name === 'Dashboard') iconName = 'grid';
          if (route.name === 'Past Scans') iconName = 'clock';
          if (route.name === 'Settings') iconName = 'settings';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              {route.name === 'Profile' ? (
                <View style={[styles.avatarContainer, isFocused && styles.avatarFocused]}>
                  <Image 
                    source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${currentUser?.name || 'Inspector'}` }} 
                    style={styles.avatar}
                  />
                </View>
              ) : (
                <Feather 
                  name={iconName} 
                  size={24} 
                  color={isFocused ? '#ffffff' : 'rgba(255,255,255,0.5)'} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  blurContainer: {
    flexDirection: 'row',
    borderRadius: 40,
    height: 76,
    width: TAB_BAR_WIDTH,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 25, 0.4)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: 76,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 0,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarFocused: {
    borderColor: '#ffffff',
    borderWidth: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
