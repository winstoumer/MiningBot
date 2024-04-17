import './navigation.scss';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {

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

    const location = useLocation();

  useEffect(() => {
    const backButton = Telegram.WebApp.BackButton;

    if (location.pathname !== '/') {
      backButton.show();
    } else {
      backButton.hide();
    }

    backButton.onClick(() => {
      history.back();
    });

    // Очистка обработчика при размонтировании компонента
    return () => {
      backButton.hide();
    };
  }, [location]);
    
    return <div className="bottom-navigation">
        <div className="navigation-block">
           <Link to="/">Mining</Link>
        </div>
        <div className="navigation-block">
            <Link to="/boost">Boost</Link>
        </div>
        <div className="navigation-block">
            <Link to="/task">Earn</Link>
        </div>
        <div className="navigation-block">
            <Link to="/market">Box</Link>
        </div>
    </div>
}
