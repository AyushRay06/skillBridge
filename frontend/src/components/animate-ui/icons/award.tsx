'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type AwardProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    ribbon: {
      initial: { y: 0 },
      animate: {
        y: [0, 2, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    circle: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.15, 1],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: AwardProps) {
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
      <motion.circle cx={12} cy={8} r={6} variants={variants.circle} initial="initial" animate={controls} />
      <motion.path
        d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
        variants={variants.ribbon}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Award(props: AwardProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Award,
  Award as AwardIcon,
  type AwardProps,
  type AwardProps as AwardIconProps,
};

