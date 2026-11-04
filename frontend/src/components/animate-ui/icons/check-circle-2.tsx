'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type CheckCircle2Props = IconProps<keyof typeof animations>;

const animations = {
  default: {
    check: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0, 1],
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
    check: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [1, 0.2, 1],
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

function IconComponent({ size = 24, ...props }: CheckCircle2Props) {
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
      <motion.path
        d="m9 12 2 2 4-4"
        variants={variants.check}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function CheckCircle2(props: CheckCircle2Props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  CheckCircle2,
  CheckCircle2 as CheckCircle2Icon,
  type CheckCircle2Props,
  type CheckCircle2Props as CheckCircle2IconProps,
};

