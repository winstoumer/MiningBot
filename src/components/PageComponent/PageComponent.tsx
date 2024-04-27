// components/PageComponent/PageComponent.tsx
import React, { useEffect, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageComponentProps {
  children: ReactNode;
}
//
const PageComponent: React.FC<PageComponentProps> = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.setHeaderColor('#000000');
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

  return <>
      {loading ? (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 9999 }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <h2>Loading...</h2>
            {/* Можно добавить сюда индикатор загрузки, например, спиннер или анимацию */}
          </div>
        </div>
      ) : (
      <>
          {children}
      </>
      )}
  </>;
};

export default PageComponent;








