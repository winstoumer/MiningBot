import React, { useEffect, useState } from 'react';
import './box.scss';
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

type BoxData = {
  total: number;
};

const Box: React.FC = () => {
    const [userData, setUserData] = useState<TelegramUserData | null>(null);
    const [boxData, setBoxData] = useState<BoxData | null>(null);

    useEffect(() => {
      // Получение данных о пользователе
      if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
          setUserData(user);
        }
      }
      
      // Получение данных о total по id пользователя
      if (userData) {
        fetchBoxTotal(userData.id);
      }
    }, [userData]);

    // Функция для получения данных о total по id пользователя
    const fetchBoxTotal = async (userId: number) => {
      try {
        const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/box/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setBoxData(data);
        } else {
          console.error('Failed to fetch box total');
        }
      } catch (error) {
        console.error('Error fetching box total:', error);
      }
    };

    return (
        <div className="content">
            <PageComponent>
                <div className="box-container">
                    <div className="box-body">
                        <div className="count-box">{boxData?.total ?? 'Loading...'}</div>
                        <div className="watch-box">
                            <img src="https://i.ibb.co/jLcwk8W/IMG-1679.jpg" className="box-image" alt="box" />
                        </div>
                        <div className="box-rewards"></div>
                        <div>
                            <button type="button" className="open-box">
                                Открыть
                            </button>
                        </div>
                    </div>
                </div>
            </PageComponent>
        </div>
    );
};

export default Box;


