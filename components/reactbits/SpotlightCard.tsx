import React, { useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, StyleProp, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';

interface SpotlightCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  spotlightColor?: string;
  borderRadius?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  style,
  spotlightColor = 'rgba(129, 140, 248, 0.15)',
  borderRadius = 24,
}) => {
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(glowOpacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(glowOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={[styles.container, { borderRadius }, style]}>
        {/* Glow overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              backgroundColor: spotlightColor,
              opacity: glowOpacity,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
            },
          ]}
          pointerEvents="none"
        />
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});

export default SpotlightCard;
