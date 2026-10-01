import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle, TextStyle, StyleProp } from 'react-native';

interface TrueFocusProps {
  sentence: string;
  borderColor?: string;
  glowColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  borderColor = '#818cf8',
  glowColor = 'rgba(129, 140, 248, 0.4)',
  style,
  textStyle,
}) => {
  const bracketAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const bracketPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(bracketAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(bracketAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    );

    const glowPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1400,
          useNativeDriver: false,
        }),
      ])
    );

    bracketPulse.start();
    glowPulse.start();

    return () => {
      bracketPulse.stop();
      glowPulse.stop();
    };
  }, []);

  const bracketOffset = bracketAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, -2],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Top-Left Corner Bracket */}
      <Animated.View
        style={[
          styles.corner,
          styles.topLeft,
          { borderColor, transform: [{ translateX: bracketOffset }, { translateY: bracketOffset }] },
        ]}
      />

      {/* Top-Right Corner Bracket */}
      <Animated.View
        style={[
          styles.corner,
          styles.topRight,
          {
            borderColor,
            transform: [
              {
                translateX: bracketOffset.interpolate({
                  inputRange: [-2, 2],
                  outputRange: [2, -2],
                }),
              },
              { translateY: bracketOffset },
            ],
          },
        ]}
      />

      {/* Target Content */}
      <View style={styles.textContainer}>
        <Text style={[styles.text, textStyle]}>{sentence}</Text>
      </View>

      {/* Bottom-Left Corner Bracket */}
      <Animated.View
        style={[
          styles.corner,
          styles.bottomLeft,
          {
            borderColor,
            transform: [
              { translateX: bracketOffset },
              {
                translateY: bracketOffset.interpolate({
                  inputRange: [-2, 2],
                  outputRange: [2, -2],
                }),
              },
            ],
          },
        ]}
      />

      {/* Bottom-Right Corner Bracket */}
      <Animated.View
        style={[
          styles.corner,
          styles.bottomRight,
          {
            borderColor,
            transform: [
              {
                translateX: bracketOffset.interpolate({
                  inputRange: [-2, 2],
                  outputRange: [2, -2],
                }),
              },
              {
                translateY: bracketOffset.interpolate({
                  inputRange: [-2, 2],
                  outputRange: [2, -2],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  text: {
    color: '#fafafa',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  corner: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderWidth: 2,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 3,
  },
});

export default TrueFocus;
