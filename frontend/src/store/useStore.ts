import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { AppState, User, Chat, Message, Theme } from '../types';

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#0088cc',
    secondary: '#6c757d',
    background: '#0e1621',
    surface: '#17212b',
    text: '#ffffff',
    textSecondary: '#8e8e93',
    border: '#2b2b2b',
    success: '#00c853',
    warning: '#ffc107',
    error: '#dc3545',
  },
};

const systemTheme: Theme = {
  mode: 'system',
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
  },
};

// Функция для получения системной темы
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Функция для получения активной темы (с учетом системной)
const getActiveTheme = (theme: Theme): Theme => {
  if (theme.mode === 'system') {
    const systemMode = getSystemTheme();
    return systemMode === 'dark' ? darkTheme : lightTheme;
  }
  return theme;
};

interface AppStore extends AppState {
  // Actions
  setCurrentUser: (user: User | null) => void;
  setChats: (chats: Chat[]) => void;
  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
  setSearchQuery: (query: string) => void;
  markMessageAsRead: (messageId: string) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  addChat: (chat: Chat) => void;
  // Computed
  getActiveTheme: () => Theme;
}

export const useStore = create<AppStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
        // Initial state
        currentUser: null,
        chats: [],
        currentChatId: null,
        messages: {},
        theme: systemTheme, // По умолчанию используем системную тему
        isTyping: {},
        searchQuery: '',

        // Computed
        getActiveTheme: () => {
          const { theme } = get();
          return getActiveTheme(theme);
        },

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),

      setChats: (chats) => set({ chats }),

      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

      addMessage: (message) => {
        const { messages } = get();
        const chatMessages = messages[message.chatId] || [];
        set({
          messages: {
            ...messages,
            [message.chatId]: [...chatMessages, message],
          },
        });
      },

      setMessages: (chatId, messages) => {
        const currentMessages = get().messages;
        set({
          messages: {
            ...currentMessages,
            [chatId]: messages,
          },
        });
      },

      toggleTheme: () => {
        const { theme } = get();
        let newTheme: Theme;
        
        if (theme.mode === 'light') {
          newTheme = darkTheme;
        } else if (theme.mode === 'dark') {
          newTheme = systemTheme;
        } else {
          newTheme = lightTheme;
        }
        
        set({ theme: newTheme });
      },

      setTheme: (theme) => set({ theme }),

      setTyping: (chatId, userId, isTyping) => {
        const { isTyping: currentTyping } = get();
        const chatTyping = currentTyping[chatId] || [];
        
        if (isTyping) {
          if (!chatTyping.includes(userId)) {
            set({
              isTyping: {
                ...currentTyping,
                [chatId]: [...chatTyping, userId],
              },
            });
          }
        } else {
          set({
            isTyping: {
              ...currentTyping,
              [chatId]: chatTyping.filter(id => id !== userId),
            },
          });
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      markMessageAsRead: (messageId) => {
        const { messages } = get();
        const updatedMessages = { ...messages };
        
        Object.keys(updatedMessages).forEach(chatId => {
          updatedMessages[chatId] = updatedMessages[chatId].map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          );
        });
        
        set({ messages: updatedMessages });
      },

      updateChat: (chatId, updates) => {
        const { chats } = get();
        set({
          chats: chats.map(chat =>
            chat.id === chatId ? { ...chat, ...updates } : chat
          ),
        });
      },

      addChat: (chat) => {
        const { chats } = get();
        set({ chats: [...chats, chat] });
      },
        }),
        {
          name: 'messenger-store',
          partialize: (state) => ({ 
            theme: state.theme,
            // Можно добавить другие поля для сохранения
          }),
        }
      )
    ),
    {
      name: 'messenger-store',
    }
  )
);

// Подписка на изменения системной темы
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleSystemThemeChange = () => {
    const state = useStore.getState();
    if (state.theme.mode === 'system') {
      // Принудительно обновляем store для перерендера
      useStore.setState({ theme: { ...state.theme } });
    }
  };

  mediaQuery.addEventListener('change', handleSystemThemeChange);
}
