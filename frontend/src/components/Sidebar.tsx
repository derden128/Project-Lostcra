import React from 'react';
import styled from 'styled-components';
import { Search, Plus, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarProps } from '../types';
import { LetterAvatar } from './LetterAvatar';
import { useStore } from '../store/useStore';

const SidebarContainer = styled.div<{ theme: any }>`
  width: 320px;
  height: 100vh;
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
  }

  @media (min-width: 769px) {
    display: flex !important;
  }
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserStatus = styled.div<{ isOnline: boolean }>`
  font-size: 12px;
  color: ${props => props.isOnline ? props.theme.colors.success : props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusDot = styled.div<{ isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.isOnline ? props.theme.colors.success : props.theme.colors.textSecondary};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-items: center;
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

const SearchContainer = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 16px 0 40px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  width: 16px;
  height: 16px;
`;

const ChatsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const ChatItem = styled.div<{ isActive: boolean }>`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isActive ? props.theme.colors.primary + '15' : 'transparent'};
  border-left: 3px solid ${props => props.isActive ? props.theme.colors.primary : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const ChatAvatar = styled.div`
  position: relative;
`;

const UnreadBadge = styled.div<{ count: number }>`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: ${props => props.count > 0 ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 0 6px;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

const LastMessage = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatTime = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
`;

const TypingIndicator = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.primary};
  font-style: italic;
`;

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  onChatSelect,
  onProfileClick,
  onSettingsClick,
}) => {
  const { currentUser, searchQuery, setSearchQuery, isTyping } = useStore();

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'сейчас';
    if (minutes < 60) return `${minutes}м`;
    if (hours < 24) return `${hours}ч`;
    if (days < 7) return `${days}д`;
    return date.toLocaleDateString();
  };

  // const getChatDisplayName = (chat: any) => {
  //   if (chat.type === 'group') return chat.name;
  //   // For private chats, show the other participant's name
  //   return chat.name;
  // };

  return (
    <SidebarContainer>
      <Header>
        <UserInfo onClick={onProfileClick}>
          <LetterAvatar
            name={currentUser?.name || 'User'}
            size="medium"
          />
          <UserDetails>
            <UserName>{currentUser?.name || 'Пользователь'}</UserName>
            <UserStatus isOnline={currentUser?.status === 'online'}>
              <StatusDot isOnline={currentUser?.status === 'online'} />
              {currentUser?.status === 'online' ? 'В сети' : 'Не в сети'}
            </UserStatus>
          </UserDetails>
        </UserInfo>
        <HeaderActions>
          <ActionButton title="Новый чат">
            <Plus size={18} />
          </ActionButton>
          <ActionButton title="Настройки" onClick={onSettingsClick}>
            <Settings size={18} />
          </ActionButton>
          <ActionButton title="Выйти">
            <LogOut size={18} />
          </ActionButton>
        </HeaderActions>
      </Header>

      <SearchContainer>
        <div style={{ position: 'relative' }}>
          <SearchIcon />
          <SearchInput
            placeholder="Поиск чатов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {}}
            onBlur={() => {}}
          />
        </div>
      </SearchContainer>

      <ChatsList>
        <AnimatePresence>
          {filteredChats.map((chat) => {
            const isActive = chat.id === currentChatId;
            const chatTyping = isTyping[chat.id] || [];
            const isSomeoneTyping = chatTyping.length > 0;

            return (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatItem
                  isActive={isActive}
                  onClick={() => onChatSelect(chat.id)}
                >
                  <ChatAvatar>
                    <LetterAvatar
                      name={chat.name}
                      size="medium"
                    />
                    {chat.unreadCount > 0 && (
                      <UnreadBadge count={chat.unreadCount}>
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </UnreadBadge>
                    )}
                  </ChatAvatar>
                  <ChatInfo>
                    <ChatName>{chat.name}</ChatName>
                    {isSomeoneTyping ? (
                      <TypingIndicator>
                        {chatTyping.length === 1 ? 'Печатает...' : 'Несколько человек печатают...'}
                      </TypingIndicator>
                    ) : (
                      <LastMessage>
                        {chat.lastMessage?.content || 'Нет сообщений'}
                      </LastMessage>
                    )}
                  </ChatInfo>
                  {!isSomeoneTyping && chat.lastMessage && (
                    <ChatTime>
                      {formatTime(chat.lastMessage.timestamp)}
                    </ChatTime>
                  )}
                </ChatItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ChatsList>
    </SidebarContainer>
  );
};
