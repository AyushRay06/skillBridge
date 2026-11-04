'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type MapProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    folds: {
      initial: { scaleY: 1 },
      animate: {
        scaleY: [1, 1.08, 0.96, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    lines: {
      initial: { opacity: 0.7 },
      animate: {
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    folds: {
      initial: { scaleY: 1 },
      animate: {
        scaleY: [1, 1.08, 0.96, 1],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    lines: {
      initial: { opacity: 0.7 },
      animate: {
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: MapProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.polygon
        points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"
        variants={variants.folds}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1={9}
        x2={9}
        y1={3}
        y2={18}
        variants={variants.lines}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1={15}
        x2={15}
        y1={6}
        y2={21}
        variants={variants.lines}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Map(props: MapProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Map,
  Map as MapIcon,
  type MapProps,
  type MapProps as MapIconProps,
};

