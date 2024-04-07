import React, { useState, useEffect } from 'react'
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
 const [coins, setCoins] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

    const [userData, setUserData] = useState<TelegramUserData | null>(null);

    useEffect(() => {
  // Проверяем, что Telegram Web App API доступен и что userData не равно null
  if (window.Telegram.WebApp && userData) {
    // Получаем монеты для пользователя
    fetchCoins(userData.id.toString());
  }
}, [userData]);

 const fetchCoins = async (userId: string) => {
    if (!userId) return; // Проверяем, что userId не равно null

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/coins/${userId}`);
      const data = await response.json();
      setCoins(data.coins);
    } catch (error) {
      console.error('Ошибка при получении монет:', error);
    }
  };

const saveCoins = async (newCoins: number) => {
  if (!userData) return; // Проверяем, что userData не равно null

  try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/coins/${userData.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coins: newCoins }),
    });
    fetchCoins(userData.id.toString());
  } catch (error) {
    console.error('Ошибка при сохранении монет:', error);
  }
};

  useEffect(() => {
    // Начальное значение счетчика
    const startCount = 0;
    // Конечное значение счетчика
    const endCount = 5;
    // Время в миллисекундах, за которое счетчик должен достичь endCount
    const duration = 5000; // 1 час
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


    const claimCoins = () => {
  if (count >= 5 && userData) {
      setCoins((prevCoins) => prevCoins + 5); // Добавляем 5 монет
    saveCoins(coins + 5); // Добавляем 5 монет
    setCount(0); // Сбрасываем счетчик
  }
};
    
    return <div>
    <div className="content">
        <div className="balance">
            <div className="title-block">Total balance (CLO)</div>
            <div className="total-balance">
                {coins.toFixed(2)}
            </div>
        </div>
        <div className="content-machine">
            <div className="watch-machine">
                <img src="https://i.ibb.co/vXLQ0d2/Designer-10.jpg" className="img-comp" />
            </div>
        </div>
        <div className="general-token">
            <div className="set-mining">
                <div className="token-title">
                    Mining  {userData ? (
        <>
        <div className="">
          {userData.username}
        </div>
        </>
      ) : (
        <div className="username">loading...</div>
      )}
                </div>
                <div className="">
                   <div className="token">
                       <span id="counter">{count.toFixed(3)}</span>
                   </div>
                   <div className="info-mine-count">
                       (5 coin per 10s)
                   </div>
                </div>
            </div>
            <div className="set-mining">
                <div className="token-title">
                    Level
                </div>
                <div className="token">
                    <span className="prm-set">6</span>
                </div>
            </div>
        </div>
        <div className="actions-mining">
                        <button className="claim-coins-btn" onClick={claimCoins} disabled={count < 5}>
        {count >= 5 ? 'Claim' : 'Collecting...'}
      </button>
        </div>
    </div>
  </div>;
};

export default Home;