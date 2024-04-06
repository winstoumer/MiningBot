import React, { useState, useEffect } from 'react'
import './home.scss';

const Home: React.FC = () => {
    // Используем useState для хранения и обновления значения счетчика
  const [count, setCount] = useState<number>(0.000001);

  useEffect(() => {
    // Функция для обновления счетчика
    const updateCounter = () => {
      setCount((prevCount) => parseFloat((prevCount + 0.000001).toFixed(6)));
    };

    // Устанавливаем таймер для обновления счетчика каждую миллисекунду
    const timerId = setTimeout(updateCounter, 1);

    // Очищаем таймер, когда компонент будет размонтирован
    return () => clearTimeout(timerId);
  }, [count]); // Зависимость от текущего значения счетчика
    return <div>
    <div className="content">
        <div className="balance">
            <div className="title-block">Total balance (CLO)</div>
            <div className="total-balance">
                2000
            </div>
        </div>
        <div className="content-machine">
            <div className="watch-machine">
                <img src="https://i.ibb.co/4p2tJP6/Designer-8.jpg" className="img-comp" />
            </div>
            <div className="manage-miners">
                <button type="submit" className="change-miner">Change miner</button>
            </div>
        </div>
        <div className="general-token">
            <div className="set-mining">
                <div className="token-title">
                    Mining
                </div>
                <div className="">
                   <div className="token">
                       <span id="counter">{count}</span>
                   </div>
                   <div className="info-mine-count">
                       (0.1 coin per hour)
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
    </div>
  </div>;
};

export default Home;