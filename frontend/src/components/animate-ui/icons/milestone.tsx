'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type MilestoneProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    sign: {
      initial: { x: 0 },
      animate: {
        x: [0, 2.5, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    pole: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    sign: {
      initial: { x: 0 },
      animate: {
        x: [0, 2.5, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    pole: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: MilestoneProps) {
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
        d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"
        variants={variants.sign}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M12 13v8"
        variants={variants.pole}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M12 3v3"
        variants={variants.pole}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Milestone(props: MilestoneProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Milestone,
  Milestone as MilestoneIcon,
  type MilestoneProps,
  type MilestoneProps as MilestoneIconProps,
};

