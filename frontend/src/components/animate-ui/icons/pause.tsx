'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@animate-ui/react/icons';

type PauseProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    bars: {
      initial: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.75, 1],
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size = 24, ...props }: PauseProps) {
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
      <motion.rect x={6} y={4} width={4} height={16} rx={1} variants={variants.bars} initial="initial" animate={controls} />
      <motion.rect x={14} y={4} width={4} height={16} rx={1} variants={variants.bars} initial="initial" animate={controls} />
    </motion.svg>
  );
}

function Pause(props: PauseProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Pause,
  Pause as PauseIcon,
  type PauseProps,
  type PauseProps as PauseIconProps,
};

