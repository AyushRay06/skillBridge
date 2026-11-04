'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type PanelLeftProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    line: {
      initial: { x: 0 },
      animate: {
        x: [0, -2, 1, 0],
        transition: {
          duration: 0.5,
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
    line: {
      initial: { x: 0 },
      animate: {
        x: [0, -2, 1, 0],
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

function IconComponent({ size = 24, ...props }: PanelLeftProps) {
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
      <motion.rect
        width={18}
        height={18}
        x={3}
        y={3}
        rx={2}
        variants={variants.frame}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M9 3v18"
        variants={variants.line}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function PanelLeft(props: PanelLeftProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  PanelLeft,
  PanelLeft as PanelLeftIcon,
  type PanelLeftProps,
  type PanelLeftProps as PanelLeftIconProps,
};

