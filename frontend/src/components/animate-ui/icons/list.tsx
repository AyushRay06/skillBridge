'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type ListProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    line1: {
      initial: { x: 0 },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      },
    },
    line2: {
      initial: { x: 0 },
      animate: {
        x: [0, 3, 0],
        transition: {
          duration: 0.5,
          delay: 0.05,
          ease: 'easeInOut',
        },
      },
    },
    line3: {
      initial: { x: 0 },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 0.4,
          delay: 0.1,
          ease: 'easeInOut',
        },
      },
    },
    dots: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    line1: {
      initial: { x: 0 },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    line2: {
      initial: { x: 0 },
      animate: {
        x: [0, 3, 0],
        transition: {
          duration: 1.2,
          delay: 0.1,
          ease: 'easeInOut',
        },
      },
    },
    line3: {
      initial: { x: 0 },
      animate: {
        x: [0, 2, 0],
        transition: {
          duration: 1.2,
          delay: 0.2,
          ease: 'easeInOut',
        },
      },
    },
    dots: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: ListProps) {
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
      <motion.line x1={8} x2={21} y1={6} y2={6} variants={variants.line1} initial="initial" animate={controls} />
      <motion.line x1={8} x2={21} y1={12} y2={12} variants={variants.line2} initial="initial" animate={controls} />
      <motion.line x1={8} x2={21} y1={18} y2={18} variants={variants.line3} initial="initial" animate={controls} />
      <motion.line x1={3} x2={3.01} y1={6} y2={6} variants={variants.dots} initial="initial" animate={controls} />
      <motion.line x1={3} x2={3.01} y1={12} y2={12} variants={variants.dots} initial="initial" animate={controls} />
      <motion.line x1={3} x2={3.01} y1={18} y2={18} variants={variants.dots} initial="initial" animate={controls} />
    </motion.svg>
  );
}

function List(props: ListProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  List,
  List as ListIcon,
  type ListProps,
  type ListProps as ListIconProps,
};

