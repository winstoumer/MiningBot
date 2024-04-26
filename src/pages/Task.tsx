import React, { useState, useEffect } from 'react';
import './task.scss';
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

    const [totalReferrals, setTotalReferrals] = useState<number>(0);

  useEffect(() => {
    const fetchReferralCount = async () => {
      
      try {
        if (!userData) return;
        const userId = userData.id.toString();
        const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/referral/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTotalReferrals(data.totalReferrals);
      } catch (error) {
        console.error('Error fetching referral count:', error);
      }
    };

    fetchReferralCount();

    // Установка интервала для обновления данных каждые 5 секунд
    const intervalId = setInterval(fetchReferralCount, 5000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [userData]);

    useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!userData) return;
        const userId = userData.id.toString();
        const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/api/tasks/${userId}`);
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
  }, [userData]);

  const handleTaskCompletion = async (taskId: number, url: string) => {
    try {
      if (!userData) return;
        
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

      // Save completed tasks to localStorage
      const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      const updatedCompletedTasks = [...completedTasks, taskId];
      localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));

      localStorage.removeItem('completedTasks');

      window.location.href = url;
    } catch (error) {
      console.error('Error completing task:', error);
    }
};

    useEffect(() => {
    // Load completed tasks from localStorage
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    // Update tasks state based on completed tasks
    setTasks(prevTasks =>
        prevTasks.map(task =>
            completedTasks.includes(task.id) ? { ...task, completed: true } : task
        )
    );
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
            <div key={task.id} style={{ cursor: 'pointer', opacity: task.completed ? 0.5 : 1 }} className="task-name">
               <div className="task">
                <div className="task-watch-image">
                  <img src={task.icon_url} className="task-img" />
                </div>
                <div className="task-info">
                  <div className="task-name">{task.name}</div>
                    <div className="task-rewards">
                      <span className="token-ic-26">
                          <img src="https://i.ibb.co/MGwQ044/AA3-A3133-7-AA5-4968-8-C51-4-F5-BE86-F1-D50.png" className="token-icon" />
                      </span>
                        {task.coin_reward}
                    </div>
                  <div className="complete-task">
                      {!task.completed && (
        <button onClick={() => !task.completed && handleTaskCompletion(task.id, task.url)} className="default-button">Go</button>
      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     ) },
    { title: 'Referral', content: <div>
        <div>
            <div className="referral-manage">
                <div className="referral-count">
                    {totalReferrals} <span className="text-signature">Invite</span>
                </div>
                <img src="https://i.ibb.co/Ptw4n4Z/Untitled.png" className="referral-image" />
                <div className="referral-info">You will receive 10 MEEN for each invitee.</div>
                <button type="button" className="default-button" onClick={handleCopyLink}>Get referral link</button>
            </div>
        </div>
    </div> },
    ];

  return <PageComponent>
      <Tabs tabs={tabs} />
  </PageComponent>;
};

export default Task;