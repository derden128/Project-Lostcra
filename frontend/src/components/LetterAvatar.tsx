import React from 'react';
import styled from 'styled-components';
import { LetterAvatarProps } from '../types';
import { generateAvatarColor, getInitials, avatarSizes } from '../utils/avatarUtils';

const AvatarContainer = styled.div<{ size: number; color: string }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => props.size * 0.4}px;
  text-transform: uppercase;
  user-select: none;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const LetterAvatar: React.FC<LetterAvatarProps> = ({
  name,
  size = 'medium',
  color,
  className,
}) => {
  const avatarColor = color || generateAvatarColor(name);
  const initials = getInitials(name);
  const sizeValue = avatarSizes[size];

  return (
    <AvatarContainer
      size={sizeValue}
      color={avatarColor}
      className={className}
      title={name}
    >
      {initials}
    </AvatarContainer>
  );
};
