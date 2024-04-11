import React, { useState, useEffect, SetStateAction } from 'react';
import './home.scss';

const fetchMiner = async (userId: string, setMinerInfo: React.Dispatch<any>) => {
  try {
    const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/miner/${userId}`);
    if (!response.ok) {
      throw new Error('Error fetching miner info');
    }
    const data = await response.json();
    if (data) {
        setMinerInfo(data);
    }
    else {
        console.error('Ошибка: Не удалось получить значения майнера из ответа API.');
    }
  } catch (error) {
      console.error('Ошибка при получении майнера:', error);
  }
};

const Home: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [coins, setCoins] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [minerInfo, setMinerInfo] = useState<any>({});

  const [nextCollectionTime, setNextCollectionTime] = useState<string | null>(null);

  const [coinsCollected, setCoinsCollected] = useState(0);
  const [totalCoinsToCollect, setTotalCoinsToCollect] = useState(0);
  const [currentCoins, setCurrentCoins] = useState<number>(0);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#ffffff'); // Установите желаемый цвет заголовка
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
      fetchNextCollectionTime(userData.id.toString());
    }
  }, [userData]);

  useEffect(() => {
    // Установите желаемый цвет заголовка здесь
    const headerColor = '#ffffff'; // Светло-голубой цвет в качестве примера

    // Проверяем, доступен ли объект Telegram.WebApp
    if (window.Telegram?.WebApp) {
      // Изменяем цвет заголовка
      window.Telegram.WebApp.setHeaderColor(headerColor);
    }
  }, []);

  useEffect(() => {
    // Начальное значение счетчика
    const startCount = 0;
    // Конечное значение счетчика
    const endCount = 5;
    // Время в миллисекундах, за которое счетчик должен достичь endCount
    const duration = 2500; // 1 час
    // Размер прироста счетчика за каждую миллисекунду
    const incrementPerMillisecond = (endCount - startCount) / duration;

    // Устанавливаем таймер для обновления счетчика
    const counterInterval = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + incrementPerMillisecond;
        // Если счетчик достиг или превысил endCount, останавливаем интервал
        if (newCount >= endCount) {
          clearInterval(counterInterval);
          return endCount;
        }
        return newCount;
      });
    }, 1);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(counterInterval);
  }, [count]);
    
const fetchNextCollectionTime = async (telegramUserId: string) => {
  try {
    const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/nextCollectionTime/${telegramUserId}`);
    const data = await response.json();

    const nextCollectionTimeUTC = new Date(data.next_collection_time);
    nextCollectionTimeUTC.setHours(nextCollectionTimeUTC.getHours() + 1);

    if (data.next_collection_time) {
      setNextCollectionTime(nextCollectionTimeUTC.toISOString());
    }
    if (data.total_coins_to_collect) {
      setTotalCoinsToCollect(data.total_coins_to_collect);
    }
  } catch (error) {
    console.error('Ошибка при получении времени следующего сбора монет:', error);
  }
};

    const fetchCoinsCollected = async (telegramUserId: string) => {
  try {
    const response = await fetch(`https://адрес_вашего_сервера/coinsCollected/${telegramUserId}`);
    const data = await response.json();
    return data.coinsCollected;
  } catch (error) {
    console.error('Ошибка при получении данных о собранных монетах:', error);
    return 0;
  }
};

const fetchTotalCoinsToCollect = async (telegramUserId: string) => {
  try {
    const response = await fetch(`https://адрес_вашего_сервера/totalCoinsToCollect/${telegramUserId}`);
    const data = await response.json();
    return data.totalCoinsToCollect;
  } catch (error) {
    console.error('Ошибка при получении общего количества монет для сбора:', error);
    return 0;
  }
};

useEffect(() => {
  const fetchData = async () => {
    if (userData && userData.id) {
      const collected = await fetchCoinsCollected(userData.id.toString());
      const totalToCollect = await fetchTotalCoinsToCollect(userData.id.toString());
      setCoinsCollected(collected);
      setTotalCoinsToCollect(totalToCollect);
    }
  };

  fetchData();
}, [userData]);

const startClaiming = () => {
  setIsClaiming(true);
  const interval = setInterval(() => {
    setCurrentCoins((prevCoins) => {
      const nextCoins = prevCoins + (totalCoinsToCollect / (nextCollectionTime - Date.now())) * 1000;
      if (nextCoins >= totalCoinsToCollect) {
        clearInterval(interval);
        setIsClaiming(false);
      }
      return nextCoins;
    });
  }, 1000);
};

useEffect(() => {
  if (isClaiming) {
    startClaiming();
  }
}, [isClaiming]);

    
  const fetchCoins = async (userId: string) => {
    try {
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins/${userId}`);
      const data = await response.json();
      if (data.coins) {
        setCoins(parseFloat(data.coins));
      } else {
        console.error('Ошибка: Не удалось получить значение монет из ответа API.');
      }
    } catch (error) {
      console.error('Ошибка при получении монет:', error);
    }
  };

  const saveCoins = async (newCoins: number) => {
    try {
      const userId = userData?.id;
      if (userId) {
        const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coins: newCoins }),
        });

        if (!response.ok) {
          console.error('Не удалось обновить баланс монет:', response.statusText);
        }
      } else {
        console.error('ID пользователя не определен.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении монет:', error);
    }
  };

    useEffect(() => {
    if (userData && userData.id) {
      fetchMiner(userData.id.toString(), setMinerInfo);
    }
  }, [userData]);

  const saveCollecting = async (collecting: number) => {
    try {
      const userId = userData?.id;
      if (userId) {
        const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/collect/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ collecting }),
        });

        if (!response.ok) {
          console.error('Не удалось сохранить коллекционные монеты:', response.statusText);
        }
      } else {
        console.error('ID пользователя не определен.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении коллекционных монет:', error);
    }
  };

  const remainingCoins = totalCoinsToCollect ? totalCoinsToCollect - coinsCollected : 0;

  const claimCoins = () => {
    if (count >= 5 && userData) {
      const newCoinAmount = coins + 5;
      setCoins(newCoinAmount);
      saveCoins(newCoinAmount);
      saveCollecting(5); // Сохраняем коллекционные монеты в таблицу Collect
      setCount(0); // Сбрасываем счетчик на 0
    }
  };

  return (
    <div className="content">
      <div className="balance">
        <div className="title-block">Total balance (CLO)</div>
        <div className="total-balance">{coins.toFixed(2)}</div>
      </div>
      <div className="content-machine">
          <div>
      <p>Время сбора монет: {nextCollectionTime}</p>
      <span>собрано: {coinsCollected}</span>
      <span>Осталось монет: {totalCoinsToCollect - coinsCollected}</span>
      <button onClick={claimCoins} disabled={totalCoinsToCollect - coinsCollected <= 0}>Claim</button>
              {isClaiming && <span>Счетчик: {currentCoins.toFixed(8)}</span>}
    <button onClick={startClaiming} disabled={isClaiming || (nextCollectionTime && new Date(nextCollectionTime).getTime() - Date.now() > 0)}>Claim</button>
    </div>
        <div className="watch-machine">
          <img src={minerInfo.miner_image_url} className="img-comp" alt="watch-machine" />
        </div>
      </div>
      <div className="general-token">
        <div className="set-mining">
          <div className="token-title">
            Mining
          </div>
          <div className="token">
            <span id="counter">{count.toFixed(3)}</span>
          </div>
          <div className="info-mine-count">({minerInfo.coin_mined} coin per {minerInfo.time_mined} m.)</div>
        </div>
        <div className="set-mining">
          <div className="token-title">Level</div>
          <div className="token">
            <span className="prm-set">{minerInfo.lvl}</span>
          </div>
          <div className="info-mine-count">{minerInfo.name}</div>
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




