'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type PhoneOffProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    line: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0, 1],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    phone: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -8, 8, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
  'default-loop': {
    line: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [1, 0.2, 1],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
    phone: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -8, 8, 0],
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: PhoneOffProps) {
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
        d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"
        variants={variants.phone}
        initial="initial"
        animate={controls}
      />
      <motion.line
        x1={22}
        x2={2}
        y1={2}
        y2={22}
        variants={variants.line}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function PhoneOff(props: PhoneOffProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  PhoneOff,
  PhoneOff as PhoneOffIcon,
  type PhoneOffProps,
  type PhoneOffProps as PhoneOffIconProps,
};

