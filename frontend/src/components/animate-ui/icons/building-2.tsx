'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type Building2Props = IconProps<keyof typeof animations>;

const animations = {
  default: {
    windows: {
      initial: { opacity: 0.6 },
      animate: {
        opacity: [0.6, 1, 0.6],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    frame: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    windows: {
      initial: { opacity: 0.6 },
      animate: {
        opacity: [0.6, 1, 0.6],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    frame: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: Building2Props) {
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
        d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"
        variants={variants.frame}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
        variants={variants.frame}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"
        variants={variants.frame}
        initial="initial"
        animate={controls}
      />
      <motion.g variants={variants.windows} initial="initial" animate={controls}>
        <motion.path d="M10 6h4" />
        <motion.path d="M10 10h4" />
        <motion.path d="M10 14h4" />
        <motion.path d="M10 18h4" />
      </motion.g>
    </motion.svg>
  );
}

function Building2(props: Building2Props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Building2,
  Building2 as Building2Icon,
  type Building2Props,
  type Building2Props as Building2IconProps,
};

