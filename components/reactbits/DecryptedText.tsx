import React, { useState, useEffect, useRef } from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  sequential?: boolean;
  revealDirection?: 'start' | 'end';
  useOriginalCharsOnly?: boolean;
  style?: StyleProp<TextStyle>;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$*&',
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  style,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let iteration = 0;
    const targetLength = text.length;
    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ')
      : characters.split('');

    const interval = setInterval(() => {
      if (!isMounted.current) return;

      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            let isRevealed = false;
            if (sequential) {
              if (revealDirection === 'start') {
                isRevealed = index < iteration;
              } else {
                isRevealed = index >= targetLength - iteration;
              }
            } else {
              isRevealed = iteration >= maxIterations;
            }

            if (isRevealed) {
              return char;
            }

            const randomChar =
              availableChars[Math.floor(Math.random() * availableChars.length)] || '*';
            return randomChar;
          })
          .join('');
      });

      iteration += 1;

      if (iteration > (sequential ? targetLength + 2 : maxIterations)) {
        clearInterval(interval);
        if (isMounted.current) {
          setDisplayText(text);
        }
      }
    }, speed);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [text, speed, maxIterations, characters, sequential, revealDirection, useOriginalCharsOnly]);

  return <Text style={[styles.text, style]}>{displayText}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: undefined,
  },
});

export default DecryptedText;
