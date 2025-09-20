import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { GlobalStyles } from './styles/GlobalStyles';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { MobileMenu } from './components/MobileMenu';
import { NotificationProvider } from './components/Notification';
import { User, Chat, Message, NotificationData } from './types';

// Тестовые данные
const mockUser: User = {
  id: 'user1',
  name: 'Александр Иванов',
  status: 'online',
  about: 'Разработчик React приложений',
};

const mockChats: Chat[] = [
  {
    id: 'chat1',
    name: 'Мария Петрова',
    type: 'private',
    participants: ['user1', 'user2'],
    unreadCount: 3,
    isOnline: true,
    lastMessage: {
      id: 'msg1',
      chatId: 'chat1',
      senderId: 'Мария Петрова',
      content: 'Привет! Как дела с проектом?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
      type: 'text',
      isRead: false,
    },
  },
  {
    id: 'chat2',
    name: 'Рабочий чат',
    type: 'group',
    participants: ['user1', 'user3', 'user4', 'user5'],
    unreadCount: 0,
    isOnline: false,
    lastMessage: {
      id: 'msg2',
      chatId: 'chat2',
      senderId: 'Анна Смирнова',
      content: 'Встреча в 15:00 не забыли?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
      type: 'text',
      isRead: true,
    },
  },
];

// Маппинг ID пользователей на имена (может понадобиться в будущем)
// const userNames: { [key: string]: string } = {
//   'user1': 'Александр Иванов',
//   'user2': 'Мария Петрова', 
//   'user3': 'Анна Смирнова',
//   'user4': 'Дмитрий Козлов',
//   'user5': 'Елена Волкова'
// };

const mockMessages: { [chatId: string]: Message[] } = {
  chat1: [
    {
      id: 'msg1',
      chatId: 'chat1',
      senderId: 'Мария Петрова',
      content: 'Привет! Как дела?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'text',
      isRead: true,
    },
    {
      id: 'msg2',
      chatId: 'chat1',
      senderId: 'Александр Иванов',
      content: 'Привет! Всё хорошо, работаю над новым проектом',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5),
      type: 'text',
      isRead: true,
    },
    {
      id: 'msg3',
      chatId: 'chat1',
      senderId: 'Мария Петрова',
      content: 'Отлично! А что за проект?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 10),
      type: 'text',
      isRead: true,
    },
    {
      id: 'msg4',
      chatId: 'chat1',
      senderId: 'Александр Иванов',
      content: 'Мессенджер на React с современным стеком технологий',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 15),
      type: 'text',
      isRead: true,
    },
    {
      id: 'msg5',
      chatId: 'chat1',
      senderId: 'Мария Петрова',
      content: 'Звучит интересно! Покажешь когда будет готово?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'text',
      isRead: false,
    },
    {
      id: 'msg6',
      chatId: 'chat1',
      senderId: 'Мария Петрова',
      content: 'Привет! Как дела с проектом?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'text',
      isRead: false,
    },
  ],
  chat2: [
    {
      id: 'msg7',
      chatId: 'chat2',
      senderId: 'Анна Смирнова',
      content: 'Доброе утро всем!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      type: 'text',
      isRead: true,
    },
    {
      id: 'msg8',
      chatId: 'chat2',
      senderId: 'Дмитрий Козлов',
      content: 'Доброе утро!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4 + 1000 * 60 * 5),
      type: 'text',
      isRead: true,
    },
    {
      id: 'msg9',
      chatId: 'chat2',
      senderId: 'Александр Иванов',
      content: 'Привет!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4 + 1000 * 60 * 10),
      type: 'text',
      isRead: true,
    },
    {
      id: 'msg10',
      chatId: 'chat2',
      senderId: 'Анна Смирнова',
      content: 'Встреча в 15:00 не забыли?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'text',
      isRead: true,
    },
  ],
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    chats,
    currentChatId,
    messages,
    setCurrentUser,
    setChats,
    setCurrentChatId,
    setMessages,
    addMessage,
    setTyping,
    updateChat,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Инициализация тестовых данных
  useEffect(() => {
    setCurrentUser(mockUser);
    setChats(mockChats);
    setMessages('chat1', mockMessages.chat1);
    setMessages('chat2', mockMessages.chat2);
    
    // Автоматически выбираем первый чат
    if (mockChats.length > 0 && !currentChatId) {
      setCurrentChatId(mockChats[0].id);
    }
  }, [setCurrentUser, setChats, setMessages, setCurrentChatId, currentChatId]);

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsMobileMenuOpen(false);
  };

  const handleSendMessage = (content: string) => {
    if (!currentChatId || !currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: currentChatId,
      senderId: currentUser.name, // Используем имя вместо ID
      content,
      timestamp: new Date(),
      type: 'text',
      isRead: false,
    };

    addMessage(newMessage);

    // Обновляем последнее сообщение в чате
    const chat = chats.find(c => c.id === currentChatId);
    if (chat) {
      updateChat(currentChatId, {
        lastMessage: newMessage,
        unreadCount: 0,
      });
    }

    // Показываем уведомление об отправке
    addNotification({
      type: 'success',
      title: 'Сообщение отправлено',
      message: 'Ваше сообщение было успешно отправлено',
      duration: 2000,
    });
  };

  const handleTyping = (isTyping: boolean) => {
    if (!currentChatId || !currentUser) return;
    setTyping(currentChatId, currentUser.id, isTyping);
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setChats([]);
    setCurrentChatId(null);
    setMessages('', []);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsMobileMenuOpen(false);
  };

  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = `notification_${Date.now()}`;
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Desktop Sidebar - всегда видна на десктопе */}
        <div style={{ display: 'none' }} className="desktop-sidebar">
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
          />
        </div>

        {/* Mobile Menu - только для мобильных устройств */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
          />
        </MobileMenu>
        
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <ChatArea
                  chat={currentChat || null}
                  messages={currentMessages}
                  currentUserId={currentUser?.id || ''}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                />
              }
            />
            <Route
              path="/profile"
              element={
                currentUser ? (
                  <ProfilePage
                    user={currentUser}
                    onUpdateProfile={handleUpdateProfile}
                    onLogout={handleLogout}
                  />
                ) : null
              }
            />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  onBack={() => navigate('/')}
                />
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      
      <NotificationProvider
        notifications={notifications}
        onClose={removeNotification}
      />

    </>
  );
};

const App: React.FC = () => {
  const { getActiveTheme } = useStore();
  const activeTheme = getActiveTheme();

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles theme={activeTheme} />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
