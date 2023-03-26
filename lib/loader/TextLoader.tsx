import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

interface TextLoaderProps {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
}

const TextLoader: React.FC<TextLoaderProps> = ({ text = 'Loading', textStyle }) => {
  const [opacities, setOpacities] = useState<[number, number, number]>([0, 0, 0]);
  const patterns = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1],
  ];
  const timers: NodeJS.Timeout[] = [];

  useEffect(() => {
    _animation(1);
    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  const _animation = (index: number) => {
    const id = setTimeout(() => {
      setOpacities(patterns[index] as [any, any, any]);
      index++;
      if (index >= patterns.length) index = 0;
      _animation(index);
    }, 500);
    timers.push(id);
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={textStyle}>{text}</Text>
      {opacities.map((item, i) => (
        <Text key={i} style={[{ opacity: item }, textStyle]}>
          .
        </Text>
      ))}
    </View>
  );
};

export default TextLoader;
