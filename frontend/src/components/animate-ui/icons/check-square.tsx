'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type CheckSquareProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    check: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0, 1],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    box: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    check: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [1, 0.2, 1],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    box: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: CheckSquareProps) {
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
        d="M9 11l3 3L22 4"
        variants={variants.check}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
        variants={variants.box}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function CheckSquare(props: CheckSquareProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  CheckSquare,
  CheckSquare as CheckSquareIcon,
  type CheckSquareProps,
  type CheckSquareProps as CheckSquareIconProps,
};

