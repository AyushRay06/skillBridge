'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type RadioProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    waves: {
      initial: { opacity: 0.5, scale: 0.95 },
      animate: {
        opacity: [0.5, 1, 0.5],
        scale: [0.95, 1.05, 0.95],
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      },
    },
    dot: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    waves: {
      initial: { opacity: 0.5, scale: 0.95 },
      animate: {
        opacity: [0.5, 1, 0.5],
        scale: [0.95, 1.05, 0.95],
        transition: {
          duration: 1.5,
          ease: 'easeInOut',
        },
      },
    },
    dot: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: {
          duration: 1.5,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: RadioProps) {
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
      <motion.path
        d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"
        variants={variants.waves}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"
        variants={variants.waves}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        cx={12}
        cy={12}
        r={2}
        variants={variants.dot}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"
        variants={variants.waves}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M19.1 4.9C23 8.8 23 15.1 19.1 19"
        variants={variants.waves}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Radio(props: RadioProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Radio,
  Radio as RadioIcon,
  type RadioProps,
  type RadioProps as RadioIconProps,
};

