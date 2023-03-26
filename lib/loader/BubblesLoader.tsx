import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { Surface } from '@react-native-community/art';

import AnimatedCircle from '../animated/AnimatedCircle';
import { color } from '../const';

interface BubblesLoaderProps {
  color?: string;
  dotRadius?: number;
  size?: number;
  dotCount?: number;
}

const DEFAULT_DOT_COUNT = 8;

const createOpacitiesArray = (count: number) => {
  const opacities = [];
  for (let i = 0; i < count; i++) {
    opacities.push(new Animated.Value(1));
  }
  return opacities;
};

const BubblesLoader: React.FC<BubblesLoaderProps> = ({
  color: propColor = color,
  dotRadius = 10,
  size = 40,
  dotCount = DEFAULT_DOT_COUNT,
}) => {
  const [opacities, setOpacities] = useState(createOpacitiesArray(dotCount));

  const eachDegree = 360 / opacities.length;
  const timers: NodeJS.Timeout[] = [];
  let unmounted = false;

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    opacities.forEach((item, i) => {
      const id = setTimeout(() => {
        _animation(i);
      }, i * 150);
      timersRef.current.push(id);
    });

    return () => {
      unmounted = true;
      timersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const _animation = useCallback(
    (i: number) => {
      Animated.sequence([
        Animated.timing(opacities[i], {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(opacities[i], {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start(() => {
        !unmounted && _animation(i);
      });
    },
    [opacities, unmounted],
  );

  const positions = useMemo(() => {
    return opacities.map((item, i) => {
      let radian = (i * eachDegree * Math.PI) / 180;
      let x = Math.round((size / 2) * Math.cos(radian)) + size / 2 + dotRadius / 2;
      let y = Math.round((size / 2) * Math.sin(radian)) + size / 2 + dotRadius / 2;
      return { x, y };
    });
  }, [dotRadius, eachDegree, opacities, size]);

  return (
    <Surface width={size + dotRadius} height={size + dotRadius}>
      {opacities.map((item, i) => {
        return (
          <AnimatedCircle
            key={i}
            radius={dotRadius}
            fill={propColor}
            x={positions[i].x}
            y={positions[i].y}
            scale={opacities[i]}
          />
        );
      })}
    </Surface>
  );
};

export default BubblesLoader;
