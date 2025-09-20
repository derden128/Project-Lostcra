import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Sun, Moon, Monitor, Bell, Shield, Palette, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Theme } from '../types';

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

const SettingsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Content = styled(motion.div)`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const Section = styled(motion.div)`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SettingIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const SettingDetails = styled.div`
  flex: 1;
`;

const SettingName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2px;
`;

const SettingDescription = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ThemeSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const ThemeOption = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.isActive ? props.theme.colors.primary + '20' : 'transparent'};
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-size: 13px;
  font-weight: ${props => props.isActive ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  justify-content: center;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.isActive ? props.theme.colors.primary + '25' : props.theme.colors.primary + '10'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ToggleSwitch = styled.button<{ isActive: boolean }>`
  width: 48px;
  height: 26px;
  border-radius: 13px;
  background-color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  position: relative;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: ${props => props.isActive ? `0 2px 8px ${props.theme.colors.primary}40` : 'none'};

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: white;
    transition: all 0.3s ease;
    transform: ${props => props.isActive ? 'translateX(22px)' : 'translateX(0)'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    transform: scale(1.05);
  }
`;

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { theme, setTheme } = useStore();

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    let newTheme: Theme;
    
    if (newMode === 'light') {
      newTheme = { ...lightTheme, mode: 'light' };
    } else if (newMode === 'dark') {
      newTheme = { ...darkTheme, mode: 'dark' };
    } else {
      newTheme = { ...systemTheme, mode: 'system' };
    }
    
    setTheme(newTheme);
  };

  const getThemeIcon = (mode: 'light' | 'dark' | 'system') => {
    switch (mode) {
      case 'light':
        return <Sun size={14} />;
      case 'dark':
        return <Moon size={14} />;
      case 'system':
        return <Monitor size={14} />;
    }
  };

  const getThemeLabel = (mode: 'light' | 'dark' | 'system') => {
    switch (mode) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Темная';
      case 'system':
        return 'Системная';
    }
  };

  return (
    <SettingsContainer
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <BackButton onClick={onBack}>
          <ArrowLeft size={20} />
        </BackButton>
        <HeaderTitle>Настройки</HeaderTitle>
      </Header>

      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <SectionTitle>
            <Palette size={16} />
            Внешний вид
          </SectionTitle>
          
          <SettingItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <SettingInfo>
              <SettingIcon>
                <Palette size={18} />
              </SettingIcon>
              <SettingDetails>
                <SettingName>Тема оформления</SettingName>
                <SettingDescription>Выберите цветовую схему приложения</SettingDescription>
              </SettingDetails>
            </SettingInfo>
            <ThemeSelector>
              <ThemeOption
                isActive={theme.mode === 'light'}
                onClick={() => handleThemeChange('light')}
              >
                {getThemeIcon('light')}
                {getThemeLabel('light')}
              </ThemeOption>
              <ThemeOption
                isActive={theme.mode === 'dark'}
                onClick={() => handleThemeChange('dark')}
              >
                {getThemeIcon('dark')}
                {getThemeLabel('dark')}
              </ThemeOption>
              <ThemeOption
                isActive={theme.mode === 'system'}
                onClick={() => handleThemeChange('system')}
              >
                {getThemeIcon('system')}
                {getThemeLabel('system')}
              </ThemeOption>
            </ThemeSelector>
          </SettingItem>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <SectionTitle>
            <Bell size={16} />
            Уведомления
          </SectionTitle>
          
          <SettingItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <SettingInfo>
              <SettingIcon>
                <Bell size={18} />
              </SettingIcon>
              <SettingDetails>
                <SettingName>Push-уведомления</SettingName>
                <SettingDescription>Получать уведомления о новых сообщениях</SettingDescription>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch isActive={true} />
          </SettingItem>

          <SettingItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <SettingInfo>
              <SettingIcon>
                <Bell size={18} />
              </SettingIcon>
              <SettingDetails>
                <SettingName>Звуковые уведомления</SettingName>
                <SettingDescription>Воспроизводить звук при получении сообщений</SettingDescription>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch isActive={false} />
          </SettingItem>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <SectionTitle>
            <Shield size={16} />
            Приватность
          </SectionTitle>
          
          <SettingItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <SettingInfo>
              <SettingIcon>
                <Shield size={18} />
              </SettingIcon>
              <SettingDetails>
                <SettingName>Статус "В сети"</SettingName>
                <SettingDescription>Показывать другим пользователям, что вы онлайн</SettingDescription>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch isActive={true} />
          </SettingItem>

          <SettingItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <SettingInfo>
              <SettingIcon>
                <Globe size={18} />
              </SettingIcon>
              <SettingDetails>
                <SettingName>Последний раз в сети</SettingName>
                <SettingDescription>Показывать время последней активности</SettingDescription>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch isActive={false} />
          </SettingItem>
        </Section>
      </Content>
    </SettingsContainer>
  );
};
