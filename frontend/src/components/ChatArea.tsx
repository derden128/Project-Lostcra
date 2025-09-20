import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Smile, Paperclip, MoreVertical, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatAreaProps } from '../types';
import { LetterAvatar } from './LetterAvatar';
import { AnimatedMessage } from './AnimatedMessage';
import { useStore } from '../store/useStore';

const ChatContainer = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
`;

const ChatHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.surface};
  min-height: 72px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChatInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatStatus = styled.div<{ $isOnline: boolean }>`
  font-size: 12px;
  color: ${props => props.$isOnline ? props.theme.colors.success : props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusDot = styled.div<{ $isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? props.theme.colors.success : props.theme.colors.textSecondary};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: ${props => props.theme.colors.background};
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 18px;
  max-width: 100px;
  margin-bottom: 8px;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  
  div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.textSecondary};
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
  
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const InputContainer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 24px;
  padding: 10px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}15, 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  min-height: 20px;
  max-height: 120px;
  padding: 8px 0;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  color: ${props => props.theme.colors.text};
  background: transparent;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const InputActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;
  background-color: transparent;

  &:hover {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SendButton = styled(InputButton)<{ $canSend: boolean }>`
  background-color: ${props => props.$canSend ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$canSend ? 'white' : props.theme.colors.textSecondary};
  box-shadow: ${props => props.$canSend ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'};

  &:hover {
    background-color: ${props => props.$canSend ? props.theme.colors.primary + 'dd' : props.theme.colors.surface};
    transform: ${props => props.$canSend ? 'scale(1.1)' : 'scale(1.05)'};
    box-shadow: ${props => props.$canSend ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'};
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 32px;
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const EmptyStateButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary}dd;
    transform: translateY(-1px);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

interface ChatAreaPropsExtended extends ChatAreaProps {
  onOpenMobileMenu?: () => void;
}

export const ChatArea: React.FC<ChatAreaPropsExtended> = ({
  chat,
  messages,
  currentUserId,
  currentUser,
  onSendMessage,
  onTyping,
  onOpenMobileMenu,
}) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const { isTyping: typingUsers } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim() && chat) {
      onSendMessage(messageText.trim());
      setMessageText('');
      setIsTyping(false);
      onTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1000);
  };

  const getChatDisplayName = (chat: any) => {
    if (chat.type === 'group') return chat.name;
    // For private chats, show the other participant's name
    return chat.name;
  };

  const isChatOnline = chat?.isOnline || false;
  const chatTyping = chat ? typingUsers[chat.id] || [] : [];
  const isSomeoneTyping = chatTyping.length > 0;

  if (!chat) {
    return (
      <ChatContainer>
        <MobileMenuButton onClick={onOpenMobileMenu} title="Открыть меню">
          <Menu size={20} />
        </MobileMenuButton>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <h3>Выберите чат</h3>
          <p>Начните общение, выбрав чат из списка</p>
          <EmptyStateButton onClick={onOpenMobileMenu}>
            Открыть список чатов
          </EmptyStateButton>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatInfo>
          <LetterAvatar
            name={chat.name}
            size="medium"
          />
          <div>
            <ChatName>{chat.name}</ChatName>
            <ChatStatus $isOnline={isChatOnline}>
              <StatusDot $isOnline={isChatOnline} />
              {isChatOnline ? 'В сети' : 'Не в сети'}
            </ChatStatus>
          </div>
        </ChatInfo>
        <HeaderActions>
          <ActionButton title="Дополнительно">
            <MoreVertical size={18} />
          </ActionButton>
        </HeaderActions>
      </ChatHeader>

      <MessagesContainer>
        <AnimatePresence>
          {messages.map((message, index) => {
            // Определяем, является ли сообщение моим
            const isOwn = message.senderId === currentUser?.name || message.senderId === currentUserId;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
            
            const showAvatar = true; // Всегда показываем аватары
            
            const showTimestamp = true;

            return (
              <AnimatedMessage
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showTimestamp={showTimestamp}
              />
            );
          })}
        </AnimatePresence>

        {isSomeoneTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '8px' }}>
              <div style={{ flexShrink: 0 }}>
                <LetterAvatar
                  name="Печатает"
                  size="small"
                />
              </div>
              <TypingIndicator>
                <TypingDots>
                  <div />
                  <div />
                  <div />
                </TypingDots>
              </TypingIndicator>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <MessageInput
            value={messageText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            rows={1}
          />
          <InputActions>
            <InputButton title="Эмодзи">
              <Smile size={18} />
            </InputButton>
            <InputButton title="Прикрепить файл">
              <Paperclip size={18} />
            </InputButton>
            <SendButton
              $canSend={messageText.trim().length > 0}
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              title="Отправить"
            >
              <Send size={18} />
            </SendButton>
          </InputActions>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};