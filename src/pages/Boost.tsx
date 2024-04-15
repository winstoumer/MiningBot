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
  const [minerInfo, setMinerInfo] = useState<any>({});
  const [minerId, setMinerId] = useState<number | null>(null); // добавляем состояние для хранения id майнера
  // Добавляем состояние для баланса монет
const [balance, setBalance] = useState<number | null>(null);

// Вызываем API для получения баланса монет
useEffect(() => {
  const fetchBalance = async () => {
    try {
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins/${userData?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      const data = await response.json();
      setBalance(data.coins);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  if (userData) {
    fetchBalance();
  }
}, [userData]);

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

  useEffect(() => {
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

    if (userData) {
      fetchMiners();
      fetchMiner(); // вызываем fetchMiner здесь
    }
  }, [userData]);

  const handleUpgrade = async (minerId: number) => {
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

    // Обновление данных после успешного обновления miner_id
    const updatedMinerInfo = await response.json();
    
    // Обновляем данные о майнере
    setMinerInfo(updatedMinerInfo);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Примерно 100 миллисекунд
      
    // Обновляем данные о майнерах
    fetchMiners();

    // Устанавливаем новый id майнера
    setMinerId(minerId);
  } catch (error) {
    console.error('Ошибка при обновлении майнера:', error);
  }
};

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

  return (
    <div className="content">
      <div className="boost-content">
        <div className="boost-list">
            <div className="balance">Balance: {balance !== null ? balance : 'Loading...'}</div>
          {miners.map((miner) => (
            <div key={miner.miner_id} className={`boost-item ${miner.lvl !== undefined && miner.lvl !== minerInfo.lvl + 1 ? 'boost-closed' : ''}`}>
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



