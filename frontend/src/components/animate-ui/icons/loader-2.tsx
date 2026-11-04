'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type Loader2Props = IconProps<keyof typeof animations>;

const animations = {
  default: {
    spinner: {
      initial: { rotate: 0 },
      animate: {
        rotate: 360,
        transition: {
          repeat: Infinity,
          duration: 1,
          ease: 'linear',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: Loader2Props) {
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
        d="M21 12a9 9 0 1 1-6.219-8.56"
        variants={variants.spinner}
        initial="initial"
        animate="animate"
      />
    </motion.svg>
  );
}

function Loader2(props: Loader2Props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Loader2,
  Loader2 as Loader2Icon,
  type Loader2Props,
  type Loader2Props as Loader2IconProps,
};

