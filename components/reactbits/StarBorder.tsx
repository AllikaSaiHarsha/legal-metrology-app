import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, StyleProp } from 'react-native';

interface StarBorderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  color?: string;
  speed?: number;
  borderRadius?: number;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  children,
  style,
  color = '#818cf8',
  speed = 2,
  borderRadius = 16,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: speed * 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: speed * 1000,
          useNativeDriver: false,
        }),
      ])
    );

    const borderSweep = Animated.loop(
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: speed * 1500,
        useNativeDriver: false,
      })
    );

    pulse.start();
    borderSweep.start();

    return () => {
      pulse.stop();
      borderSweep.stop();
    };
  }, [speed]);

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      color,
      'rgba(255, 255, 255, 0.9)',
      '#c084fc',
      'rgba(255, 255, 255, 0.9)',
      color,
    ],
  });

  return (
    <Animated.View
      style={[
        styles.outerContainer,
        {
          borderRadius,
          borderColor: animatedBorderColor,
          shadowColor: color,
          shadowOpacity: pulseAnim,
          shadowRadius: 10,
          elevation: 6,
        },
        style,
      ]}
    >
      <View style={[styles.innerContent, { borderRadius }]}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  innerContent: {
    overflow: 'hidden',
  },
});

export default StarBorder;
