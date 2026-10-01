import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, GestureResponderEvent, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  anim: Animated.Value;
}

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  sparkRadius?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  activeOpacity?: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = '#818cf8',
  sparkCount = 8,
  sparkRadius = 28,
  style,
  onPress,
  activeOpacity = 0.85,
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkIdCounter = useRef(0);

  const handlePress = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;

    // Trigger subtle haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }

    const newSparks: Spark[] = [];
    const baseId = sparkIdCounter.current;
    sparkIdCounter.current += sparkCount;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (2 * Math.PI * i) / sparkCount;
      const anim = new Animated.Value(0);

      newSparks.push({
        id: baseId + i,
        x: locationX,
        y: locationY,
        angle,
        distance: sparkRadius + Math.random() * 8,
        anim,
      });

      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        // Clean up when done
        setSparks((prev) => prev.filter((s) => s.id !== baseId + i));
      });
    }

    setSparks((prev) => [...prev.slice(-16), ...newSparks]);

    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePress}
      style={[styles.container, style]}
    >
      {children}

      {/* Render Spark Particles */}
      {sparks.map((spark) => {
        const translateX = spark.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(spark.angle) * spark.distance],
        });
        const translateY = spark.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(spark.angle) * spark.distance],
        });
        const opacity = spark.anim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 0.8, 0],
        });
        const scale = spark.anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.2, 0.2],
        });

        return (
          <Animated.View
            key={spark.id}
            pointerEvents="none"
            style={[
              styles.spark,
              {
                left: spark.x - 3,
                top: spark.y - 3,
                backgroundColor: sparkColor,
                opacity,
                transform: [{ translateX }, { translateY }, { scale }],
              },
            ]}
          />
        );
      })}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  spark: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default ClickSpark;
