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

const fetchMiner = async (userId: string, setMinerInfo: React.Dispatch<any>) => {
  try {
    const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/miner/${userId}`);
    if (!response.ok) {
      throw new Error('Error fetching miner info');
    }
    const data = await response.json();
    if (data) {
      setMinerInfo(data);
    } else {
      console.error('Ошибка: Не удалось получить значения майнера из ответа API.');
    }
  } catch (error) {
    console.error('Ошибка при получении майнера:', error);
  }
};

const Boost: React.FC = () => {
  const [userData, setUserData] = useState<TelegramUserData | null>(null);
  const [miners, setMiners] = useState<Miner[]>([]);
  const [minerInfo, setMinerInfo] = useState<any>({});

  useEffect(() => {
    const fetchMiners = async () => {
      try {
        const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/miners/${userData?.id}`);
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
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserData(user);
        fetchMiner(userData.id.toString(), setMinerInfo);
      }
    }
  }, []);

  return (
    <div className="content">
      <div className="boost-content">
        <div className="boost-list">
          {miners.map((miner) => (
            <div key={miner.miner_id} className="boost-item">
              <div className="boost-description">
                <div className="boost-watch">
                  <img src={miner.miner_image_url} className="boost-image" alt={miner.name} />
                </div>
                <div className="boost-info">
                  <div className="boost-name">
                    <span className="boost-level">{`${miner.lvl} level`}</span>
                  </div>
                  <div className="boost-mined">{`${miner.coin_mined} in 1 hours`}</div>
                  <div className="boost-price">{`${miner.price_miner} C`}</div>
                </div>
              </div>
              <div className="boost-action">
                  {minerInfo.lvl === (miner.lvl ?? 0) +1 ? (
                <button
                  type="button"
                  className="boost-upgrade">
                  Upgrade
                </button>
                ) : miner.lvl > minerInfo.lvl()}
              </div>
              <div className="line-upgrade"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boost;
