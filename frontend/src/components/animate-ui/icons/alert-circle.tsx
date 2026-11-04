'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type AlertCircleProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    mark: {
      initial: { scale: 1, y: 0 },
      animate: {
        scale: [1, 1.2, 1],
        y: [0, -1, 0],
        transition: {
          duration: 0.5,
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
    mark: {
      initial: { scale: 1, y: 0 },
      animate: {
        scale: [1, 1.2, 1],
        y: [0, -1, 0],
        transition: {
          duration: 1.2,
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

function IconComponent({ size = 24, ...props }: AlertCircleProps) {
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
      <motion.g variants={variants.mark} initial="initial" animate={controls}>
        <motion.line x1={12} x2={12} y1={8} y2={12} />
        <motion.line x1={12} x2={12.01} y1={16} y2={16} />
      </motion.g>
    </motion.svg>
  );
}

function AlertCircle(props: AlertCircleProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  AlertCircle,
  AlertCircle as AlertCircleIcon,
  AlertCircle as CircleAlert,
  AlertCircle as CircleAlertIcon,
  type AlertCircleProps,
  type AlertCircleProps as AlertCircleIconProps,
};

