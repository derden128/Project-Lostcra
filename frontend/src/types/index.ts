export interface User {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  about?: string;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'emoji';
  isRead: boolean;
  replyTo?: string;
}

export interface Chat {
  id: string;
  name: string;
  type: 'private' | 'group';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isOnline?: boolean;
  avatar?: string;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

export interface AppState {
  currentUser: User | null;
  chats: Chat[];
  currentChatId: string | null;
  messages: { [chatId: string]: Message[] };
  theme: Theme;
  isTyping: { [chatId: string]: string[] };
  searchQuery: string;
}

export interface LetterAvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
}

export interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

export interface ChatAreaProps {
  chat: Chat | null;
  messages: Message[];
  currentUserId: string;
  currentUser?: User | null;
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export interface ProfilePageProps {
  user: User;
  onUpdateProfile: (updates: Partial<User>) => void;
  onLogout: () => void;
}

export interface SettingsPageProps {
  onBack: () => void;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}
