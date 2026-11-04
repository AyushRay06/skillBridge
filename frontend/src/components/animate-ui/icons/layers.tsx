'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type LayersProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    top: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    mid: {
      initial: { y: 0 },
      animate: {
        y: [0, -1, 0],
        transition: {
          duration: 0.5,
          delay: 0.05,
          ease: 'easeInOut',
        },
      },
    },
    bot: {
      initial: { y: 0 },
      animate: {
        y: [0, 0, 0],
      },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    top: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    mid: {
      initial: { y: 0 },
      animate: {
        y: [0, -1, 0],
        transition: {
          duration: 1.2,
          delay: 0.1,
          ease: 'easeInOut',
        },
      },
    },
    bot: {
      initial: { y: 0 },
      animate: {
        y: [0, 0, 0],
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: LayersProps) {
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
        d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
        variants={variants.top}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
        variants={variants.bot}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
        variants={variants.mid}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Layers(props: LayersProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Layers,
  Layers as LayersIcon,
  type LayersProps,
  type LayersProps as LayersIconProps,
};

