import React, { useState } from 'react';
import './task.scss';

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

    const telegramGroupUrl = 'https://t.me/notcoin';
    const instagramProfileUrl = 'https://www.instagram.com/winstoum/';

    const tabs: Tab[] = [
    { title: 'Earn', content: <div><div className="title-page">
      Earn
  </div>
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
    { title: 'Referral', content: <div>Referral</div> },
    ];

  return <Tabs tabs={tabs} />;
};

export default Task;