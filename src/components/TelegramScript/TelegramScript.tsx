import React, { useEffect } from 'react';

const TelegramScript: React.FC = () => {
  useEffect(() => {
    // Функция для создания тега <script>
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        // После загрузки скрипта, проверяем, что Telegram Web App API доступен
        if (window.Telegram && window.Telegram.WebApp) {
          // Вызываем метод expand для открытия в полноэкранном режиме
          window.Telegram.WebApp.expand();
        }
      };
      document.body.appendChild(script);
    };

    // Загружаем скрипт при монтировании компонента
    loadScript();

    // Убрали часть кода, отвечающую за удаление скрипта при размонтировании компонента

  }, []); // Пустой массив зависимостей, чтобы эффект выполнился один раз

  return null; // Компонент не рендерит ничего в DOM
};

export default TelegramScript;