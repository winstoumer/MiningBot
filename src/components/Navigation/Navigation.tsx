import './navigation.scss';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {

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
