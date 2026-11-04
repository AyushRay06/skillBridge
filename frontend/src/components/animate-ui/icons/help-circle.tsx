'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type HelpCircleProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    question: {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: [0, 15, -10, 0],
        scale: [1, 1.1, 1],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    circle: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    question: {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: [0, 15, -10, 0],
        scale: [1, 1.1, 1],
        transition: {
          duration: 1.4,
          ease: 'easeInOut',
        },
      },
    },
    circle: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: HelpCircleProps) {
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
      <motion.circle
        cx={12}
        cy={12}
        r={10}
        variants={variants.circle}
        initial="initial"
        animate={controls}
      />
      <motion.g
        variants={variants.question}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: '12px 12px' }}
      >
        <motion.path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <motion.path d="M12 17h.01" />
      </motion.g>
    </motion.svg>
  );
}

function HelpCircle(props: HelpCircleProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  HelpCircle,
  HelpCircle as HelpCircleIcon,
  type HelpCircleProps,
  type HelpCircleProps as HelpCircleIconProps,
};

