'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type RefreshCwProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    arrows: {
      initial: { rotate: 0 },
      animate: {
        rotate: 360,
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    arrows: {
      initial: { rotate: 0 },
      animate: {
        rotate: 360,
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: RefreshCwProps) {
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
      <motion.g variants={variants.arrows} initial="initial" animate={controls} style={{ transformOrigin: '12px 12px' }}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </motion.g>
    </motion.svg>
  );
}

function RefreshCw(props: RefreshCwProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  RefreshCw,
  RefreshCw as RefreshCwIcon,
  type RefreshCwProps,
  type RefreshCwProps as RefreshCwIconProps,
};

