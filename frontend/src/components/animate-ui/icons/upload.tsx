'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type UploadProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    arrow: {
      initial: { y: 0 },
      animate: {
        y: [0, -3, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    tray: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    arrow: {
      initial: { y: 0 },
      animate: {
        y: [0, -3, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    tray: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: UploadProps) {
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
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        variants={variants.tray}
        initial="initial"
        animate={controls}
      />
      <motion.g variants={variants.arrow} initial="initial" animate={controls}>
        <motion.polyline points="17 8 12 3 7 8" />
        <motion.line x1={12} x2={12} y1={3} y2={15} />
      </motion.g>
    </motion.svg>
  );
}

function Upload(props: UploadProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Upload,
  Upload as UploadIcon,
  Upload as FileUp,
  Upload as FileUpIcon,
  type UploadProps,
  type UploadProps as UploadIconProps,
};

