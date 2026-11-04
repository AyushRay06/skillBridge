'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type FileSearchProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    lens: {
      initial: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.15, 1],
        rotate: [0, 8, -6, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      },
    },
    doc: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    lens: {
      initial: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.15, 1],
        rotate: [0, 8, -6, 0],
        transition: {
          duration: 1.4,
          ease: 'easeInOut',
        },
      },
    },
    doc: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: FileSearchProps) {
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
        d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3"
        variants={variants.doc}
        initial="initial"
        animate={controls}
      />
      <motion.polyline
        points="14 2 14 8 20 8"
        variants={variants.doc}
        initial="initial"
        animate={controls}
      />
      <motion.g
        variants={variants.lens}
        initial="initial"
        animate={controls}
        style={{ transformOrigin: '5px 14px' }}
      >
        <motion.circle cx={5} cy={14} r={3} />
        <motion.path d="m9 18-1.5-1.5" />
      </motion.g>
    </motion.svg>
  );
}

function FileSearch(props: FileSearchProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  FileSearch,
  FileSearch as FileSearchIcon,
  type FileSearchProps,
  type FileSearchProps as FileSearchIconProps,
};

