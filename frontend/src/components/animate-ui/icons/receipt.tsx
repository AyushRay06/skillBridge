'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type ReceiptProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    sheet: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    dollar: {
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
  'default-loop': {
    sheet: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    dollar: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.15, 1],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: ReceiptProps) {
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
        d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"
        variants={variants.sheet}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"
        variants={variants.dollar}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M12 17.5v-11"
        variants={variants.dollar}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Receipt(props: ReceiptProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Receipt,
  Receipt as ReceiptIcon,
  type ReceiptProps,
  type ReceiptProps as ReceiptIconProps,
};

