'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type ShieldAlertProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    mark: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    shield: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    mark: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    shield: {
      initial: { scale: 1 },
      animate: { scale: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: ShieldAlertProps) {
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
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        variants={variants.shield}
        initial="initial"
        animate={controls}
      />
      <motion.g variants={variants.mark} initial="initial" animate={controls}>
        <motion.path d="M12 8v4" />
        <motion.path d="M12 16h.01" />
      </motion.g>
    </motion.svg>
  );
}

function ShieldAlert(props: ShieldAlertProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  ShieldAlert,
  ShieldAlert as ShieldAlertIcon,
  type ShieldAlertProps,
  type ShieldAlertProps as ShieldAlertIconProps,
};

