import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MessageBubbleProps } from '../types';
import { LetterAvatar } from './LetterAvatar';

const MessageContainer = styled.div<{ $isOwn: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-direction: row;
  margin-bottom: 12px;
  max-width: 100%;
`;

const MessageContent = styled.div<{ $isOwn: boolean }>`
  max-width: 70%;
  min-width: 60px;
  padding: 8px 12px;
  border-radius: 18px 18px 18px 4px;
  background-color: ${props => props.$isOwn ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$isOwn ? 'white' : props.theme.colors.text};
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border: ${props => props.$isOwn ? `2px solid ${props.theme.colors.primary}` : 'none'};
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 400px;
`;

const MessageTime = styled.div<{ $isOwn: boolean }>`
  font-size: 11px;
  color: ${props => props.$isOwn ? 'rgba(255, 255, 255, 0.7)' : props.theme.colors.textSecondary};
  text-align: left;
  opacity: 0.8;
  margin-top: 2px;
  align-self: flex-start;
  font-weight: 400;
`;

const MessageAvatar = styled.div`
  flex-shrink: 0;
`;

const messageVariants = {
  hidden: { 
    opacity: 0, 
    y: 10, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.98,
    transition: {
      duration: 0.2
    }
  }
};

const contentVariants = {
  hidden: { 
    scale: 0.95,
    opacity: 0 
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      delay: 0.05
    }
  }
};

export const AnimatedMessage: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar,
  showTimestamp,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMessageText = (text: string) => {
    // Переносим длинные сообщения каждые 58-60 символов
    if (text.length <= 60) return text;
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + word).length <= 58) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <MessageContainer $isOwn={isOwn}>
        <MessageAvatar>
          <LetterAvatar
            name={message.senderId}
            size="small"
          />
        </MessageAvatar>
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <MessageContent $isOwn={isOwn}>
            <div>{formatMessageText(message.content)}</div>
            {showTimestamp && (
              <MessageTime $isOwn={isOwn}>
                {formatTime(message.timestamp)}
              </MessageTime>
            )}
          </MessageContent>
        </motion.div>
      </MessageContainer>
    </motion.div>
  );
};
