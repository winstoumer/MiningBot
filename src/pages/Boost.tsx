import React, { useState, useEffect } from 'react';
import './boost.scss';
import PageComponent from '../components/PageComponent/PageComponent';

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
const [balance, setBalance] = useState<number | null>(0);
     
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
    // Выполняем запрос на обновление майнера
    const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/user_miner/${userData?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ minerId }),
    });

    console.log('Response from update miner:', response); // Выводим ответ от запроса на обновление майнера

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error('Failed to upgrade miner');
    }

    // Получаем текущее значение coins пользователя
    const balanceResponse = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins/${userData?.id}`);
    console.log('Response from fetch balance:', balanceResponse); // Выводим ответ от запроса на получение баланса пользователя
    if (!balanceResponse.ok) {
      throw new Error('Failed to fetch user balance');
    }
    const balanceData = await balanceResponse.json();
    console.log('Balance data:', balanceData); // Выводим данные о балансе пользователя
    const currentCoins = balanceData.coins;

    // Получаем цену майнера
    const miner = miners.find((miner) => miner.miner_id === minerId);
    if (!miner) {
      throw new Error('Miner not found');
    }
    console.log('Selected miner:', miner); // Выводим выбранный майнер
    const minerPrice = parseFloat(miner.price_miner);

    // Вычисляем новое значение coins после обновления
    const updatedCoins = currentCoins - minerPrice;
    console.log('Updated coins:', updatedCoins); // Выводим новое значение баланса пользователя

    // Обновляем значение coins в базе данных
    const updateBalanceResponse = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins_upgrader/${userData?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coins: updatedCoins }),
    });
    console.log('Response from update balance:', updateBalanceResponse); // Выводим ответ от запроса на обновление баланса пользователя
    if (!updateBalanceResponse.ok) {
      throw new Error('Failed to update user balance');
    }

    // Обновляем состояние майнера после успешного обновления
    const updatedMinerInfo = await response.json();
    console.log('Updated miner info:', updatedMinerInfo); // Выводим обновленную информацию о майнере
    setMinerInfo(updatedMinerInfo);

    // Задержка для обновления данных о майнерах
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Обновляем данные о майнерах
    fetchMiners();

    // Устанавливаем новый id майнера
    setMinerId(minerId);
  } catch (error) {
    console.error('Ошибка при обновлении майнера:', error);
  }
};

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserData(user);
      }
    }
  }, []);

  return (
    <PageComponent>
        <div className="content">
      <div className="boost-content">
        <div className="boost-list">
            <div className="balance">
        <div className="title-ol">Balance</div>
        <div className="total-balance">
            <span className="token-ic-50">
                  <img src="https://i.ibb.co/MGwQ044/AA3-A3133-7-AA5-4968-8-C51-4-F5-BE86-F1-D50.png" className="token-icon" />
              </span>
            {balance !== null ? balance : 'Loading...'}
        </div>
        <div className="title-boost-g">
            Your capsule
        </div>
      </div>
          {miners.map((miner) => (
            <div key={miner.miner_id} className="boost-item">
              <div className={`boost-description ${miner.lvl !== undefined && miner.lvl !== minerInfo.lvl + 1 ? 'boost-closed' : ''}`}>
                <div className="boost-watch">
                  <img src={miner.miner_image_url} className="boost-image" alt={miner.name} />
                </div>
                <div className="boost-info">
                  <div className="boost-name">
                    <span className="boost-level">{`${miner.lvl} level`}</span>
                  </div>
                  <div className="boost-mined signature-yellow-color">{`${miner.coin_mined} / ${miner.time_mined}h`}</div>
                {minerInfo.lvl === miner.lvl ? 
    <div></div> : <div className="boost-price">
        <span className="token-ic-26">
                          <img src="https://i.ibb.co/MGwQ044/AA3-A3133-7-AA5-4968-8-C51-4-F5-BE86-F1-D50.png" className="token-icon" />
                      </span>
        {`${miner.price_miner}`}
    </div>
}
                </div>
              </div>
              <div className="boost-action">
                {minerInfo.lvl !== undefined && miner.lvl !== undefined && miner.lvl === minerInfo.lvl + 1 && balance !== null && balance >= parseFloat(miner.price_miner) && (
  <button
    type="button"
    className="default-button"
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
    </PageComponent>
  );
};

export default Boost;



