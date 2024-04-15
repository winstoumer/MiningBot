import React, { useState, useEffect, useCallback } from 'react';
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
  const [minerInfo, setMinerInfo] = useState<any>({});
  const [minerId, setMinerId] = useState<number | null>(null); 

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

  const fetchMiner = async () => {
    try {
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/miner/${userData?.id}`);
      if (!response.ok) {
        throw new Error('Error fetching miner info');
      }
      const data = await response.json();
      setMinerInfo(data);
    } catch (error) {
      console.error('Ошибка при получении майнера:', error);
    }
  };

  const handleUpgrade = useCallback(async (minerId: number) => {
    try {
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/user_miner/${userData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to upgrade miner');
      }

      const updatedMinerInfo = await response.json();
      
      setMinerInfo(updatedMinerInfo);
      setMinerId(minerId);
      fetchMiners(); // Обновляем данные о майнерах

    } catch (error) {
      console.error('Ошибка при обновлении майнера:', error);
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
      }
    }
  }, []);

  useEffect(() => {
    if (userData) {
      fetchMiners();
      fetchMiner();
    }
  }, [userData, fetchMiners, fetchMiner]);

  useEffect(() => {
    // Обновляем компонент после изменения состояний
    if (minerInfo.lvl !== undefined && miners.length > 0) {
      // Принудительно вызываем перерендеринг компонента
      // Не рекомендуется делать это часто из-за производительности,
      // но это может быть полезно в данном случае
      setMinerInfo({ ...minerInfo });
      setMiners([...miners]);
    }
  }, [minerInfo, miners]);

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
                {minerInfo.lvl !== undefined && miner.lvl !== undefined && miner.lvl === minerInfo.lvl + 1 && (
                  <button
                    type="button"
                    className="boost-upgrade"
                    onClick={() => handleUpgrade(miner.miner_id)}
                  >
                    Upgrade
                  </button>
                )}
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



