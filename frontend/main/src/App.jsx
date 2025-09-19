import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [activeChat, setActiveChat] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Данные для чатов
  const [chats, setChats] = useState({
    1: {
      id: 1,
      name: 'Алексей Петров',
      avatar: '👨',
      online: true,
      messages: [
        { id: 1, text: 'Привет! Как настроение?', sender: 'friend', time: '10:30' },
        { id: 2, text: 'Привет! Отлично, спасибо! А у тебя?', sender: 'me', time: '10:32' },
        { id: 3, text: 'Тоже всё хорошо. Сегодня был продуктивный день', sender: 'friend', time: '10:35' },
        { id: 4, text: 'Класс! Что планируешь на вечер?', sender: 'me', time: '10:36' },
        { id: 5, text: 'Наверное, посмотрю новый сериал. Хочешь присоединиться?', sender: 'friend', time: '10:38' },
      ]
    },
    2: {
      id: 2,
      name: 'Мария Иванова',
      avatar: '👩',
      online: false,
      lastSeen: 'была(а) вчера в 22:15',
      messages: [
        { id: 1, text: 'Привет! Не забудь про завтрашнюю встречу', sender: 'friend', time: '09:15' },
        { id: 2, text: 'Конечно! В 14:00 в конференц-зале?', sender: 'me', time: '09:20' },
        { id: 3, text: 'Да, именно там. Жду тебя!', sender: 'friend', time: '09:22' },
      ]
    },
    3: {
      id: 3,
      name: 'Рабочая группа',
      avatar: '👥',
      online: false,
      lastSeen: 'были в сети',
      messages: [
        { id: 1, text: 'Всем привет! Напоминаю о дедлайне завтра', sender: 'friend', time: '08:45' },
        { id: 2, text: 'Спасибо за напоминание!', sender: 'me', time: '08:50' },
        { id: 3, text: 'Документы уже готовы', sender: 'friend', time: '09:30' },
        { id: 4, text: 'Отлично! Жду отчет к обеду', sender: 'friend', time: '10:15' },
      ]
    },
    4: {
      id: 4,
      name: 'Мама',
      avatar: '👩‍🦱',
      online: true,
      messages: [
        { id: 1, text: 'Здравствуй, сынок! Как дела?', sender: 'friend', time: '08:30' },
        { id: 2, text: 'Привет, мам! Всё хорошо, работаю', sender: 'me', time: '08:35' },
        { id: 3, text: 'Не забудь поесть, ты так часто пропускаешь обед', sender: 'friend', time: '08:40' },
        { id: 4, text: 'Обязательно! Спасибо за заботу', sender: 'me', time: '08:42' },
      ]
    }
  });

  // Автоматическая прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChats(prev => ({
        ...prev,
        [activeChat]: {
          ...prev[activeChat],
          messages: [...prev[activeChat].messages, newMessage]
        }
      }));
      
      setInputValue('');

      // Имитация ответа от друга через 1-3 секунды
      if (activeChat !== 3) { // Не отвечаем в групповой чат
        setTimeout(() => {
          const responses = [
            'Понял, спасибо!',
            'Интересно, расскажи подробнее',
            'Согласен с тобой',
            'Какой занятный момент!',
            'Спасибо за информацию',
            'Обязательно запишу себе',
            'Потом обязательно обсудим',
            'А я как раз хотел об этом спросить'
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          const replyMessage = {
            id: Date.now() + 1,
            text: randomResponse,
            sender: 'friend',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setChats(prev => ({
            ...prev,
            [activeChat]: {
              ...prev[activeChat],
              messages: [...prev[activeChat].messages, replyMessage]
            }
          }));
        }, 1000 + Math.random() * 2000);
      }
    }
  };

  const getCurrentChat = () => chats[activeChat];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Боковое меню */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '250px',
            backgroundColor: '#ffffff',
            zIndex: 1000,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            padding: '20px 15px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div style={{
              fontSize: '50px',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              👤
            </div>
            <div style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Иван Иванов
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#8e8e93',
              marginTop: '5px'
            }}>
              +7 (999) 123-45-67
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <div 
              style={{
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={closeSidebar}
            >
              <span style={{ marginRight: '15px', fontSize: '18px' }}>👤</span>
              <span>Мой профиль</span>
            </div>
            <div 
              style={{
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={closeSidebar}
            >
              <span style={{ marginRight: '15px', fontSize: '18px' }}>💾</span>
              <span>Сохранённые сообщения</span>
            </div>
            <div 
              style={{
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={closeSidebar}
            >
              <span style={{ marginRight: '15px', fontSize: '18px' }}>👥</span>
              <span>Контакты</span>
            </div>
            <div 
              style={{
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={closeSidebar}
            >
              <span style={{ marginRight: '15px', fontSize: '18px' }}>⚙️</span>
              <span>Настройки</span>
            </div>
            <div 
              style={{
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={closeSidebar}
            >
              <span style={{ marginRight: '15px', fontSize: '18px' }}>🌙</span>
              <span>Ночной режим</span>
            </div>
          </div>
          
          <div style={{
            padding: '15px 20px',
            borderTop: '1px solid #f0f0f0',
            color: '#8e8e93',
            fontSize: '13px'
          }}>
            Telegram Web K v1.0
          </div>
        </div>
      )}

      {/* Оверлей для закрытия бокового меню */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
          onClick={closeSidebar}
        />
      )}

      {/* Левая панель - список чатов */}
      <div style={{
        width: '30%',
        minWidth: '300px',
        maxWidth: '450px',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100
      }}>
        {/* Шапка */}
        <div style={{
          padding: '12px 15px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div 
            style={{ 
              fontSize: '24px', 
              cursor: 'pointer',
              padding: '5px'
            }}
            onClick={toggleSidebar}
          >
            ☰
          </div>
          <div>
            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '5px',
              color: '#555'
            }}>✏️</button>
            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '5px',
              color: '#555',
              marginLeft: '10px'
            }}>⚙️</button>
          </div>
        </div>

        {/* Поиск */}
        <div style={{ padding: '10px 15px' }}>
          <div style={{
            backgroundColor: '#f0f2f5',
            borderRadius: '18px',
            padding: '8px 15px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px', opacity: '0.6' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Поиск"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Список чатов */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {Object.values(chats).map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              style={{
                padding: '12px 15px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: activeChat === chat.id ? '#f0f2f5' : 'transparent',
                borderLeft: activeChat === chat.id ? '3px solid #667eea' : 'none'
              }}
            >
              <div style={{ 
                fontSize: '32px', 
                marginRight: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {chat.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    fontWeight: activeChat === chat.id ? '600' : 'normal',
                    fontSize: '15px'
                  }}>
                    {chat.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: '#8e8e93'
                  }}>
                    {chat.messages[chat.messages.length - 1]?.time || ''}
                  </div>
                </div>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#8e8e93',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '70%'
                  }}>
                    {chat.messages[chat.messages.length - 1]?.text || 'Нет сообщений'}
                  </div>
                  {chat.id === 2 && (
                    <div style={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      1
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Правая панель - чат */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {getCurrentChat() && (
          <>
            {/* Шапка чата */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  marginRight: '15px',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCurrentChat().avatar}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>
                    {getCurrentChat().name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#8e8e93' }}>
                    {getCurrentChat().online 
                      ? 'в сети' 
                      : getCurrentChat().lastSeen || 'был(а) недавно'
                    }
                  </div>
                </div>
              </div>
              <div>
                <button style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#555'
                }}>📞</button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#555',
                  marginLeft: '5px'
                }}>📹</button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#555',
                  marginLeft: '5px'
                }}>⋮</button>
              </div>
            </div>

            {/* Сообщения */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              backgroundColor: '#e6ebee',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23d1d7db" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")'
            }}>
              {getCurrentChat().messages.map((message) => (
                <div 
                  key={message.id} 
                  style={{
                    display: 'flex',
                    marginBottom: '15px',
                    justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {message.sender === 'friend' && getCurrentChat().id !== 3 && (
                    <div style={{ 
                      fontSize: '32px', 
                      marginRight: '10px',
                      alignSelf: 'flex-end'
                    }}>
                      {getCurrentChat().avatar}
                    </div>
                  )}
                  <div style={{
                    maxWidth: '60%',
                    padding: '8px 12px',
                    borderRadius: '15px',
                    position: 'relative',
                    backgroundColor: message.sender === 'me' ? '#667eea' : '#ffffff',
                    color: message.sender === 'me' ? 'white' : '#000000',
                    borderBottomLeftRadius: message.sender === 'friend' ? '5px' : '15px',
                    borderBottomRightRadius: message.sender === 'me' ? '5px' : '15px',
                    boxShadow: message.sender === 'friend' ? '0 1px 1px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    <div style={{ 
                      marginBottom: '4px', 
                      wordWrap: 'break-word',
                      fontSize: '15px',
                      lineHeight: '1.4'
                    }}>
                      {message.text}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      opacity: '0.7',
                      textAlign: 'right'
                    }}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div style={{
              padding: '10px 15px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e0e0e0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f0f2f5',
                borderRadius: '20px',
                padding: '5px 15px'
              }}>
                <button 
                  type="button" 
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#555'
                  }}
                >
                  📎
                </button>
                <button 
                  type="button" 
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#555'
                  }}
                >
                  😊
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Напишите сообщение..."
                  style={{
                    flex: '1',
                    padding: '12px 15px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '15px'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e);
                    }
                  }}
                />
                <button 
                  type="button" 
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#555'
                  }}
                >
                  🎤
                </button>
                {inputValue.trim() !== '' && (
                  <button 
                    type="submit"
                    onClick={handleSendMessage}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '8px',
                      color: '#667eea'
                    }}
                  >
                    ➤
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;