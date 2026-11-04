'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type Code2Props = IconProps<keyof typeof animations>;

const animations = {
  default: {
    leftBracket: {
      initial: { x: 0 },
      animate: {
        x: [0, -2, 0],
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      },
    },
    rightBracket: {
      initial: { x: 0 },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      },
    },
    slash: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 8, 0],
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    leftBracket: {
      initial: { x: 0 },
      animate: {
        x: [0, -2, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    rightBracket: {
      initial: { x: 0 },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    slash: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 8, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: Code2Props) {
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
      <motion.path d="m18 16 4-4-4-4" variants={variants.rightBracket} initial="initial" animate={controls} />
      <motion.path d="m6 8-4 4 4 4" variants={variants.leftBracket} initial="initial" animate={controls} />
      <motion.path d="m14.5 4-5 16" variants={variants.slash} initial="initial" animate={controls} style={{ transformOrigin: '12px 12px' }} />
    </motion.svg>
  );
}

function Code2(props: Code2Props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Code2,
  Code2 as Code2Icon,
  type Code2Props,
  type Code2Props as Code2IconProps,
};

