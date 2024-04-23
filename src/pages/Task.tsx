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
                      {task.coin_reward} 
                      <span className="token-ic-16">
                          <img src="https://i.ibb.co/nzbVcWv/timeminecoin-icon.png" className="token-icon" />
                      </span>
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
                <img src="https://i.ibb.co/1KnjQ0t/Designer-105.jpg" className="referral-image" />
                <div className="referral-info">You will receive 100 coins for each invitee.</div>
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