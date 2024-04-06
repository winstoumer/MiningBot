import React, { useEffect, useState } from 'react';
import './telegramuser.scss';

// Определите тип для данных пользователя
type TelegramUserData = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

const TelegramUser: React.FC = () => {
  const [userData, setUserData] = useState<TelegramUserData | null>(null);

  useEffect(() => {
    // Проверяем, что Telegram Web App API доступен
    if (window.Telegram.WebApp) {
      // Получаем данные пользователя
      setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
    }
  }, []);

  // Рендерим информацию о пользователе или сообщение, если данные недоступны
  return (
    <div className="user-block">
      {userData ? (
        <>
        <div className="photo">
            <img src={userData.photo_url} className="photo-url" alt="User" />
        </div>
        <div className="username">
          {userData.username}
        </div>
        </>
      ) : (
        <div className="username">Loading...</div>
      )}
    </div>
  );
};

export default TelegramUser;