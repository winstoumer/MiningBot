import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './home.scss';

type TelegramUserData = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

const Home: React.FC = () => {
  const [userData, setUserData] = useState<TelegramUserData | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

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

  useEffect(() => {
    if (userData && userData.id) {
      fetchCoins(userData.id.toString());
    }
  }, [userData]);

  const fetchCoins = async (userId: string) => {
  try {
    const response = await fetch('https://advisory-brandi-webapp.koyeb.app/api/coins/${userId}');
    const data = await response.json();
    if (data.coins) {
      setCoins(prevCoins => parseFloat(data.coins) || prevCoins); // Обновляем состояние coins с использованием функции обратного вызова
    } else {
      console.error('Не удалось получить значение монет из ответа API.');
    }
  } catch (error) {
    console.error('Ошибка при получении монет:', error);
  }
};
  const saveCoins = async (newCoins: number) => {
    try {
      const userId = userData?.id;
      if (userId) {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/coins/${userId}`, { coins: newCoins });
        fetchCoins(userId.toString());
      } else {
        console.error('ID пользователя не определен.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении монет:', error);
    }
  };

  useEffect(() => {
    const startCount = 0;
    const endCount = 5;
    const duration = 2500; // Изменил время на 10 секунд
    const incrementPerMillisecond = (endCount - startCount) / duration;

    const counterInterval = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + incrementPerMillisecond;
        if (newCount >= endCount) {
          clearInterval(counterInterval);
          return endCount;
        }
        return newCount;
      });
    }, 10); // Установил интервал в 10 миллисекунд

    return () => clearInterval(counterInterval);
  }, [count]);

  const claimCoins = () => {
    if (count >= 5 && userData) {
      const newCoinAmount = coins + 5;
      setCoins(newCoinAmount);
      saveCoins(newCoinAmount);
      setCount(0);
    }
  };

  return (
    <div className="content">
      <div className="balance">
        <div className="title-block">Total balance (CLO)</div>
        <div className="total-balance">{coins.toFixed(2)}</div>
      </div>
      <div className="content-machine">
        <div className="watch-machine">
          <img src="https://i.ibb.co/vXLQ0d2/Designer-10.jpg" className="img-comp" alt="watch-machine" />
        </div>
      </div>
      <div className="general-token">
        <div className="set-mining">
          <div className="token-title">
            Mining {userData ? <div className="username">{userData.id}</div> : <div className="username">loading...</div>}
          </div>
          <div className="token">
            <span id="counter">{count.toFixed(3)}</span>
          </div>
          <div className="info-mine-count">(5 coin per 10s)</div>
        </div>
        <div className="set-mining">
          <div className="token-title">Level</div>
          <div className="token">
            <span className="prm-set">8</span>
          </div>
        </div>
      </div>
      <div className="actions-mining">
        <button className="claim-coins-btn" onClick={claimCoins} disabled={count < 5}>
          {count >= 5 ? 'Claim' : 'Collecting...'}
        </button>
      </div>
    </div>
  );
};

export default Home;
