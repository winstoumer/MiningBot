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

interface Miner {
  miner_id: number;
  lvl: number;
  time_mined: number;
  name: string;
  coin_mined: string;
  price_miner: string;
  miner_image_url: string;
}

const Boost: React.FC = () => {

    const [userData, setUserData] = useState<TelegramUserData | null>(null);

    const [miners, setMiners] = useState<Miner[]>([]);

  useEffect(() => {
  const fetchMiners = async () => {
    try {
      const response = await fetch(`/api/miners/${userData?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch miners');
      }
      const data = await response.json();
      setMiners(data);
    } catch (error) {
      console.error('Error fetching miners:', error);
    }
  };

  if (userData) {
    fetchMiners();
  }
}, [userData]);

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
    if (window.Telegram && window.Telegram.WebApp) {
      setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
    }
  }, []);

  return (
      <div className="content">
      <div className="boost-content">
        <div className="boost-list">
          {miners.map((miner) => (
            <div key={miner.miner_id} className="boost-item">
              <div className="boost-watch">
                <img src={miner.miner_image_url} className="boost-image" alt={miner.name} />
              </div>
              <div className="boost-info">
                <div className="boost-name">
                  <span className="boost-level">{`${miner.lvl} level`}</span>
                </div>
                <div className="boost-mined">{`${miner.coin_mined} in 1 hours`}</div>
                <div className="boost-price">{`${miner.price_mined} C`}</div>
              </div>
                <div className="boost-action">
                  <button type="button" className="boost-upgrade">
                    Upgrade
                  </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boost;