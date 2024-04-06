import React, { useState, useEffect } from 'react'
import './home.scss';

const Home: React.FC = () => {
    const [coins, setCoins] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

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

  // Функция для сбора монет
  const claimCoins = () => {
    if (count >= 5) {
      setCoins((prevCoins) => prevCoins + 5); // Добавляем 5 монет
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
                <img src="https://i.ibb.co/4p2tJP6/Designer-8.jpg" className="img-comp" />
            </div>
        </div>
        <div className="general-token">
            <div className="set-mining">
                <div className="token-title">
                    Mining
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