// components/PageComponent/PageComponent.tsx
import React, { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageComponentProps {
  children: ReactNode;
}

const PageComponent: React.FC<PageComponentProps> = ({ children }) => {
  const location = useLocation();

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
      window.history.back(); // Используем нативную JavaScript функцию для перехода назад
    });

    // Очистка обработчика при размонтировании компонента
    return () => {
      backButton.hide();
    };
  }, [location]);

  return <div>{children}</div>;
};

export default PageComponent;


