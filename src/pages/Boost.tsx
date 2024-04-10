import React, { useState, useEffect } from 'react';
import './boost.scss';

type TelegramUserData = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

const Boost: React.FC = () => {

    const [userData, setUserData] = useState<TelegramUserData | null>(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.expand();
        }
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
    }
  }, []);

  return (<div className="boost-content">
      <div className="boost-balance">
      </div>
      <div className="boost-item-default">
              <div className="boost-watch">
                  <img src="https://i.ibb.co/4p2tJP6/Designer-8.jpg" className="boost-image" />
              </div>
              <div className="boost-info">
                  <div className="boost-name">
                      <span className="boost-level">1 level</span>
                  </div>
                  <div className="boost-mined">60 in 1 hours</div>
              </div>
          </div>
      <div className="line-upgrade">
      </div>
      <div className="boost-list">
          <div className="boost-item">
              <div className="boost-watch">
                  <img src="https://i.ibb.co/HtJ3B0G/Designer-46.jpg" className="boost-image" />
              </div>
              <div className="boost-info">
                  <div className="boost-name">
                      <span className="boost-level">2 level</span>
                  </div>
                  <div className="boost-mined">120 in 2 hours</div>
                  <div className="boost-price">200 clo</div>
              </div>
          </div>
          <div className="boost-action">
              <button type="button" className="boost-upgrade">Upgrade</button>
          </div>
      </div>
  </div>);
};

export default Boost;