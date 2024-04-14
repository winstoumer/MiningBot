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

interface Task {
  id: number;
  name: string;
  coin_reward: number;
  url: string;
  completed: boolean;
  icon_url: string;
}

const Tabs: React.FC<{ tabs: Tab[] }> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="content">
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

    const [tasks, setTasks] = useState<Task[]>([]);

    const [userData, setUserData] = useState<TelegramUserData | null>(null);

    useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = userData.id.toString();
        const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/tasks/${userId}`); // Замените 123456789 на реальный telegram_user_id
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCompletion = async (taskId: number, url: string) => {
    try {
      const userId = userData.id.toString();
      const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/completed_tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: taskId, telegram_user_id: userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to complete task');
      }
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
        window.location.href = url; // Перенаправление на URL задания
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#ffffff');
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

    const tabs: Tab[] = [
    { title: 'Earn',
     content: (
         <div>
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} onClick={() => handleTaskCompletion(task.id)} style={{ cursor: 'pointer', opacity: task.completed ? 0.5 : 1 }} className="task-name">
              <div className="task">
                <div className="task-watch-image">
                  <img src={task.icon_url} className="task-img" />
                </div>
                <div className="task-info">
                  <div className="task-name">{task.name}</div>
                  {!task.completed && (
                    <div className="task-rewards">
                      {task.coin_reward}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     ) },
    { title: 'Referral', content: <div>
        <div className="content">
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