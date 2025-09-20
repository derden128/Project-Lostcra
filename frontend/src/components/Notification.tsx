import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.error;
      case 'warning': return props.theme.colors.warning;
      case 'info': return props.theme.colors.primary;
      default: return props.theme.colors.primary;
    }
  }};
  overflow: hidden;
`;

const NotificationContent = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.error;
      case 'warning': return props.theme.colors.warning;
      case 'info': return props.theme.colors.primary;
      default: return props.theme.colors.primary;
    }
  }};
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const Message = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 4px;
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

const ProgressBar = styled.div<{ duration: number }>`
  height: 3px;
  background-color: ${props => props.theme.colors.primary};
  animation: progress ${props => props.duration}ms linear;
  transform-origin: left;

  @keyframes progress {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
`;

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

const getIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'success': return <CheckCircle size={20} />;
    case 'error': return <AlertCircle size={20} />;
    case 'warning': return <AlertTriangle size={20} />;
    case 'info': return <Info size={20} />;
    default: return <Info size={20} />;
  }
};

export const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose,
}) => {
  const duration = notification.duration || 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <NotificationContainer type={notification.type}>
        <NotificationContent>
          <IconContainer type={notification.type}>
            {getIcon(notification.type)}
          </IconContainer>
          <TextContent>
            <Title>{notification.title}</Title>
            <Message>{notification.message}</Message>
          </TextContent>
          <CloseButton onClick={() => onClose(notification.id)}>
            <X size={16} />
          </CloseButton>
        </NotificationContent>
        <ProgressBar duration={duration} />
      </NotificationContainer>
    </motion.div>
  );
};

// Notification Provider Component
const NotificationProviderContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
`;

const NotificationWrapper = styled.div`
  pointer-events: auto;
  margin-bottom: 12px;
`;

interface NotificationProviderProps {
  notifications: NotificationData[];
  onClose: (id: string) => void;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <NotificationProviderContainer>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationWrapper key={notification.id}>
            <Notification
              notification={notification}
              onClose={onClose}
            />
          </NotificationWrapper>
        ))}
      </AnimatePresence>
    </NotificationProviderContainer>
  );
};
