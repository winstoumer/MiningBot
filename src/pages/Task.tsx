import React, { useState, useEffect } from 'react';
import './task.scss';

type TelegramUserData = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

interface Tab {
  title: string;
  content: React.ReactNode;
}

const Tabs: React.FC<{ tabs: Tab[] }> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={index === activeTab ? 'active tab-button' : 'tab-button'}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  );
};

const Task: React.FC = () => {

    const [userData, setUserData] = useState<TelegramUserData | null>(null);

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

     const handleCopyLink = () => {
    const userId = userData && userData.id ? userData.id : 'null';
    const referralLink = `https://t.me/minerweb3_bot?start=r_${userId}`;
    navigator.clipboard.writeText(referralLink)
        .then(() => alert('Link copied to clipboard'))
        .catch((error) => console.error('Error copying link: ', error));
};

    const telegramGroupUrl = 'https://t.me/notcoin';
    const instagramProfileUrl = 'https://www.instagram.com/winstoum/';

    const tabs: Tab[] = [
    { title: 'Earn', content: <div>
      <div className="task-list">
          <a href={telegramGroupUrl} className="task-name" target="_blank" rel="noopener noreferrer">
      <div className="task">
          <div className="task-watch-image">
              <img src="https://i.ibb.co/R64qNrF/Designer-18.jpg" className="task-img" />
          </div>
          <div className="task-info">
              <div className="task-name">Follow Miner on Telegram</div>
              <div className="task-rewards">
                  +50 000
              </div>
          </div>
      </div>
          </a>
          <a href={instagramProfileUrl} className="task-name" target="_blank" rel="noopener noreferrer">
      <div className="task">
          <div className="task-watch-image">
              <img src="https://i.ibb.co/30HfdZc/Designer-15.jpg" className="task-img" />
          </div>
          <div className="task-info">
              <a href={instagramProfileUrl} className="task-name" target="_blank" rel="noopener noreferrer">Follow Miner on Instagram</a>
              <div className="task-rewards">
                  +50 000
              </div>
          </div>
      </div>
          </a>
      <div className="task">
          <div className="task-watch-image">
              <img src="https://i.ibb.co/PDXJ0ST/Designer-12.jpg" className="task-img" />
          </div>
          <div className="task-info">
              <div className="task-name">
                 Follow Miner on X 
              </div>
              <div className="task-rewards">
                  +50 000
              </div>
          </div>
      </div>
  </div>
    </div> },
    { title: 'Referral', content: <div>
        <div className="referral-content">
            <div className="referral-manage">
                <img src="https://i.ibb.co/JCcfw0m/Designer-59.jpg" className="referral-image" />
                <div className="referral-info">You will receive 100 coins for each invitee.</div>
                <button type="button" className="referral-copy-button" onClick={handleCopyLink}>Get referral link</button>
            </div>
        </div>
    </div> },
    ];

  return <Tabs tabs={tabs} />;
};

export default Task;