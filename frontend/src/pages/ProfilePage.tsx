import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Edit2, Save, X, Palette, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfilePageProps } from '../types';
import { LetterAvatar } from '../components/LetterAvatar';
import { generateAvatarColor } from '../utils/avatarUtils';

const ProfileContainer = styled(motion.div)`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
`;

const ProfileHeader = styled(motion.div)`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: ${props => props.theme.colors.surface};
  min-height: 80px;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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

const ProfileContent = styled(motion.div)`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const ProfileCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const AvatarEditButton = styled.button`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 12px;
`;

const ColorOption = styled.button<{ color: string; isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 3px solid ${props => props.isSelected ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-size: 14px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${props.theme.colors.primary};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.primary}dd;
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background-color: ${props.theme.colors.error};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.error}dd;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background-color: transparent;
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover {
            background-color: ${props.theme.colors.surface};
          }
        `;
    }
  }}
`;


const avatarColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A9DFBF', '#F9E79F', '#D5A6BD', '#A3E4D7', '#FADBD8'
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateProfile,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    about: user.about || '',
    status: user.status,
  });
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(
    generateAvatarColor(user.name)
  );

  const handleSave = () => {
    onUpdateProfile({
      ...editedUser,
      avatar: selectedAvatarColor,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.name,
      about: user.about || '',
      status: user.status,
    });
    setSelectedAvatarColor(generateAvatarColor(user.name));
    setIsEditing(false);
  };

  return (
    <ProfileContainer
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <ProfileHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <BackButton onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
        </BackButton>
        <HeaderTitle>Профиль</HeaderTitle>
      </ProfileHeader>

      <ProfileContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <AvatarSection>
            <AvatarContainer>
              <LetterAvatar
                name={editedUser.name}
                size="large"
                color={selectedAvatarColor}
              />
              {isEditing && (
                <AvatarEditButton>
                  <Palette size={16} />
                </AvatarEditButton>
              )}
            </AvatarContainer>
            {isEditing && (
              <ColorPalette>
                {avatarColors.map((color) => (
                  <ColorOption
                    key={color}
                    color={color}
                    isSelected={selectedAvatarColor === color}
                    onClick={() => setSelectedAvatarColor(color)}
                  />
                ))}
              </ColorPalette>
            )}
          </AvatarSection>

          <FormSection as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <FormLabel>Имя</FormLabel>
            <FormInput
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              disabled={!isEditing}
              placeholder="Введите ваше имя"
            />
          </FormSection>

          <FormSection as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <FormLabel>Статус</FormLabel>
            <FormInput
              value={editedUser.status === 'online' ? 'В сети' : 'Не в сети'}
              disabled
              placeholder="Статус"
            />
          </FormSection>

          <FormSection as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <FormLabel>О себе</FormLabel>
            <FormTextarea
              value={editedUser.about}
              onChange={(e) => setEditedUser({ ...editedUser, about: e.target.value })}
              disabled={!isEditing}
              placeholder="Расскажите о себе..."
            />
          </FormSection>

          <ActionButtons as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={handleCancel}>
                  <X size={16} />
                  Отмена
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  <Save size={16} />
                  Сохранить
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                Редактировать
              </Button>
            )}
          </ActionButtons>
        </ProfileCard>

        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Button variant="danger" onClick={onLogout}>
            <LogOut size={16} />
            Выйти из аккаунта
          </Button>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};
