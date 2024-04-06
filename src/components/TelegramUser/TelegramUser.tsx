import React, { useEffect, useState } from 'react';

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
    <div>
      {userData ? (
        <div>
          <h3>User Information</h3>
          <p>ID: {userData.id}</p>
          <p>First Name: {userData.first_name}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default TelegramUser;