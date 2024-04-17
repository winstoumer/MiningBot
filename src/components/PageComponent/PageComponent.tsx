// components/PageComponent/PageComponent.tsx
import React, { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageComponentProps {
  children: ReactNode;
}

const PageComponent: React.FC<PageComponentProps> = ({ children }) => {
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

          // Set up the back button after the script is loaded and Telegram WebApp is available
          const backButton = window.Telegram.WebApp.BackButton;
          backButton.onClick(() => {
            console.log('Back button clicked');
            navigate(-1); // Use navigate with a negative number to go back
          });

          // Show or hide the back button based on the current path
          if (window.location.pathname !== '/') {
            backButton.show();
          } else {
            backButton.hide();
          }
        }
      };
      document.body.appendChild(script);
    };

    loadScript();

    // Clean up the back button when the component is unmounted
    return () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide();
      }
    };
  }, [navigate]);

  return <div>{children}</div>;
};

export default PageComponent;








