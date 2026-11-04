'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type TargetProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    bullseye: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    inner: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 0.5,
          delay: 0.05,
          ease: 'easeInOut',
        },
      },
    },
    outer: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    bullseye: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    inner: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 1.2,
          delay: 0.1,
          ease: 'easeInOut',
        },
      },
    },
    outer: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: TargetProps) {
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
      <motion.circle cx={12} cy={12} r={10} variants={variants.outer} initial="initial" animate={controls} />
      <motion.circle cx={12} cy={12} r={6} variants={variants.inner} initial="initial" animate={controls} />
      <motion.circle cx={12} cy={12} r={2} variants={variants.bullseye} initial="initial" animate={controls} />
    </motion.svg>
  );
}

function Target(props: TargetProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Target,
  Target as TargetIcon,
  type TargetProps,
  type TargetProps as TargetIconProps,
};

