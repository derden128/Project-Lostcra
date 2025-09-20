import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  position: relative;
`;

const SpinnerRing = styled.div<{ size: number; color: string }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 3px solid ${props => props.color}20;
  border-top: 3px solid ${props => props.color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.div<{ delay: number; color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  animation: ${spin} 1.4s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
`;

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  variant?: 'ring' | 'dots';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = '#007bff',
  variant = 'ring',
  className,
}) => {
  if (variant === 'dots') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
      >
        <SpinnerDots>
          <Dot delay={0} color={color} />
          <Dot delay={0.16} color={color} />
          <Dot delay={0.32} color={color} />
        </SpinnerDots>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={className}
    >
      <SpinnerContainer size={size}>
        <SpinnerRing size={size} color={color} />
      </SpinnerContainer>
    </motion.div>
  );
};
