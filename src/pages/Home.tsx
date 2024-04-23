import React, { useState, useEffect } from 'react';
import './home.scss';
import PageComponent from '../components/PageComponent/PageComponent';

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

const Home: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
    const [timeMined, setTimeMined] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [minerInfo, setMinerInfo] = useState<any>({});
  const [nextCollectionTime, setNextCollectionTime] = useState<string | null>(null);

  const [totalCoinsToCollect, setTotalCoinsToCollect] = useState<number>(0);
  const [currentCoins, setCurrentCoins] = useState<number>(0);
  

     
  const [coinsCollected, setCoinsCollected] = useState<number>(0); // Количество уже собранных монет
  const [isClaiming, setIsClaiming] = useState<boolean>(false); // Флаг, указывающий, идет ли сбор монет в данный момент
    const [startCoins, setStartCoins] = useState<number>(0.00000000); // Начальное значение для счетчика монет

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
    }
  }, []);

  useEffect(() => {
    if (userData && userData.id) {
      fetchCoins(userData.id.toString());
      fetchNextCollectionTime(userData.id.toString(), setTimeMined);
      fetchMiner(userData.id.toString(), setMinerInfo);
    }
  }, [userData]);


  useEffect(() => {
    const startCount = 0;
    const endCount = 5;
    const duration = 2500;
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
    }, 1);

    return () => clearInterval(counterInterval);
  }, [count]);

    useEffect(() => {
        const storedNextCollectionTime = localStorage.getItem('nextCollectionTime');
        if (storedNextCollectionTime) {
            setNextCollectionTime(storedNextCollectionTime);
        }
    }, []);

  const fetchNextCollectionTime = async (telegramUserId: string, setTimeMined: React.Dispatch<any>) => {
  try {
    const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/nextCollectionTime/${telegramUserId}`);
    if (!response.ok) {
      throw new Error('Error fetching next collection time');
    }
    const data = await response.json();
    const nextCollectionTimeUTC = new Date(data.next_collection_time);
    nextCollectionTimeUTC.setHours(nextCollectionTimeUTC.getHours() + data.time_mined);

    if (data.next_collection_time) {
      setNextCollectionTime(nextCollectionTimeUTC.toISOString());
        localStorage.setItem('nextCollectionTime', nextCollectionTimeUTC.toISOString());
    }

    if (data.time_mined) {
      setTimeMined(data.time_mined);
    }
  } catch (error) {
    console.error('Ошибка при получении времени следующего сбора монет:', error);
  }
};

  const fetchCoinsCollected = async (telegramUserId: string) => {
    try {
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/coinsCollected/${telegramUserId}`);
      if (!response.ok) {
        throw new Error('Error fetching coins collected');
      }
      const data = await response.json();
      return data.coinsCollected;
    } catch (error) {
      console.error('Ошибка при получении данных о собранных монетах:', error);
      return 0;
    }
  };

  const fetchTotalCoinsToCollect = async (telegramUserId: string) => {
    try {
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/totalCoinsToCollect/${telegramUserId}`);
      if (!response.ok) {
        throw new Error('Error fetching total coins to collect');
      }
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
        try {
          const collected = await fetchCoinsCollected(userData.id.toString());
          const totalToCollect = await fetchTotalCoinsToCollect(userData.id.toString());
          setCoinsCollected(collected);
          setTotalCoinsToCollect(totalToCollect);
        } catch (error) {
          console.error('Ошибка при получении данных о монетах:', error);
        }
      }
    };

    fetchData();
  }, [userData]);

useEffect(() => {
  if (nextCollectionTime && totalCoinsToCollect > 0 && isClaiming) {
    const collectionEndTime = new Date(nextCollectionTime).getTime();
    const collectionDuration = collectionEndTime - Date.now();
    const coinsPerMillisecond = totalCoinsToCollect / collectionDuration;

    let currentCoins = 0;
    let lastTimestamp = Date.now();

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastTimestamp;

      currentCoins += elapsedTime * coinsPerMillisecond; // Добавляем монеты, учитывая прошедшее время
      lastTimestamp = currentTime;

      setCurrentCoins(currentCoins);

      if (currentTime >= collectionEndTime) {
        clearInterval(interval);
        setIsClaiming(false);
        setCurrentCoins(totalCoinsToCollect);
      }
    }, 1); // Обновляем каждую миллисекунду

    return () => clearInterval(interval);
  }
}, [nextCollectionTime, totalCoinsToCollect, isClaiming]);


const [hoursLeft, setHoursLeft] = useState<number>(0);
    
  const [minutesLeft, setMinutesLeft] = useState<number>(0);
    const [secondsLeft, setSecondsLeft] = useState<number>(0);
  //. Вычисление времени до следующей коллекции при монтировании компонента
  useEffect(() => {
  const updateCountdown = () => {
    if (nextCollectionTime) {
      const currentTime = new Date().getTime();
      const collectionEndTime = new Date(nextCollectionTime).getTime();
      const timeLeftMilliseconds = collectionEndTime - currentTime;
      const timeLeftHours = Math.floor(timeLeftMilliseconds / (1000 * 60 * 60));
      const timeLeftMinutes = Math.floor((timeLeftMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const timeLeftSeconds = Math.floor((timeLeftMilliseconds % (1000 * 60)) / 1000); // Добавляем секунды
      setHoursLeft(timeLeftHours);
      setMinutesLeft(timeLeftMinutes);
      setSecondsLeft(timeLeftSeconds); // Устанавливаем состояние для секунд
    }
  };

  updateCountdown(); // Вызываем сразу для инициализации
  const interval = setInterval(updateCountdown, 1000); // Обновляем каждую секунду (1000 миллисекунд)
  
  return () => clearInterval(interval);
}, [nextCollectionTime]);

    
  const fetchCoins = async (userId: string) => {
    try {
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins/${userId}`);
      if (!response.ok) {
        throw new Error('Error fetching coins');
      }
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

  const saveCoinsLast = async (newCoins: number) => {
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

    const saveCoins = async (coinsMined: number) => {
  try {
    const userId = userData?.id;
    if (userId) {
      // Получаем текущее значение баланса пользователя
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins/${userId}`);
      if (!response.ok) {
        throw new Error('Error fetching current coins');
      }
      const data = await response.json();
      const currentCoins = parseFloat(data.coins);

      // Вычисляем новое значение баланса, добавляя coinsMined к текущему балансу
      const newCoins = currentCoins + coinsMined;

      // Обновляем баланс пользователя в базе данных
      const updateResponse = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/coins/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coins: newCoins }),
      });

      if (!updateResponse.ok) {
        console.error('Не удалось обновить баланс монет:', updateResponse.statusText);
      }
    } else {
      console.error('ID пользователя не определен.');
    }
  } catch (error) {
    console.error('Ошибка при сохранении монет:', error);
  }
};


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
      //const newCoinAmount = coins + 5;
      //setCoins(newCoinAmount);
      //saveCoins(newCoinAmount);.
      saveCollecting(5);
      setCount(0);
    }
  };

    const claimCoinsNow = async () => {
  if (userData) {
      try {
          const result = parseFloat(minerInfo.coin_mined) + coins;
    await saveCoinsLast(result); // Сохраняем новое общее количество монет в базе данных
     await saveCollecting(minerInfo.coin_mined); // Сохраняем количество монет, добытых во время последней коллекции
      await fetchCoins(userData.id.toString());
      await fetchNextCollectionTime(userData.id.toString(), setTimeMined);
        }
      catch (error) {
                console.error('Error claiming coins:', error);
            }
  }
};

  return (
      <PageComponent>
    <div className="content">
      <div className="balance">
        <div className="title-block">Balance MEEN</div>
        <div className="total-balance">{coins.toFixed(2)}</div>
      </div>
      <div className="content-machine">
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
            <span id="counter">{hoursLeft > 0 || minutesLeft > 0 ? `${hoursLeft} : ${minutesLeft} : ${secondsLeft}` : '00 : 00 : 00'}</span>
          </div>
          <div className="info-mine-count">{minerInfo.coin_mined} MEEN per {minerInfo.time_mined} h</div>
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
         <button 
    className={`default-button ${hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0 ? '' : 'collecting-now'}`} 
    onClick={claimCoinsNow} 
    disabled={hoursLeft > 0 || minutesLeft > 0 || secondsLeft > 0}
>
    {hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0 ? 'Claim' : 'Mining active..'}
</button>

      </div>
    </div>
          </PageComponent>
  );
};

export default Home;






