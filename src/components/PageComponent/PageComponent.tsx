// components/PageComponent/PageComponent.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PageComponent: React.FC = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.setHeaderColor('#ffffff');
          window.Telegram.WebApp.expand();
        }
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, []); 

  useEffect(() => {
    const backButton = window.Telegram.WebApp.BackButton;

    if (window.location.pathname !== '/') {
      backButton.show();
    } else {
      backButton.hide();
    }

    backButton.onClick(() => {
      navigate(-1); // Используем navigate с отрицательным числом для перехода назад
    });

    // Очистка обработчика при размонтировании компонента
    return () => {
      backButton.hide();
    };
  }, [navigate]);

  return <div>{children}</div>;
};

export default PageComponent;







