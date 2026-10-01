import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextStyle, StyleProp } from 'react-native';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  style?: StyleProp<TextStyle>;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 3,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (disabled) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: speed * 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: speed * 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [disabled, speed]);

  const textColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#94a3b8', '#ffffff', '#94a3b8'],
  });

  const textShadowOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0],
  });

  if (disabled) {
    return <Animated.Text style={[styles.text, style]}>{text}</Animated.Text>;
  }

  return (
    <Animated.Text
      style={[
        styles.text,
        style,
        {
          color: textColor,
          textShadowColor: 'rgba(255, 255, 255, 0.75)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 6,
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
  },
});

export default ShinyText;
