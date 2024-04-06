import React from 'react'
import './task.scss';

const Task: React.FC = () => {
    const telegramGroupUrl = 'https://t.me/notcoin';
    const instagramProfileUrl = 'https://www.instagram.com/yourusername/';
    
  return <div>
  <div className="title-page">
      Earn
  </div>
      <div className="task-list">
      <div className="task">
          <div className="task-watch-image">
              <img src="https://i.ibb.co/R64qNrF/Designer-18.jpg" className="task-img" />
          </div>
          <div className="task-info">
              <a href={telegramGroupUrl} className="task-name" target="_blank" rel="noopener noreferrer">Follow Miner on Telegram</a>
              <div className="task-rewards">
                  +50 000
              </div>
          </div>
      </div>
      <div className="task">
          <div className="task-watch-image">
              <img src="https://i.ibb.co/PDXJ0ST/Designer-12.jpg" className="task-img" />
          </div>
          <div className="task-info">
              <a href={instagramProfileUrl} className="task-name" target="_blank" rel="noopener noreferrer">Follow Miner on Instagram</a>
              <div className="task-rewards">
                  +50 000
              </div>
          </div>
      </div>
      <div className="task">
          <div className="task-watch-image">
              <img src="https://i.ibb.co/30HfdZc/Designer-15.jpg" className="task-img" />
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
  </div>;
};

export default Task;