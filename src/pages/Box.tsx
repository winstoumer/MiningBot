import React, { useEffect, useState, useCallback } from 'react';
import './box.scss';
import PageComponent from '../components/PageComponent/PageComponent';
import { v4 as uuidv4 } from 'uuid'; // Импортируем функцию для генерации UUID
import ReactJson, { InteractionProps } from 'react-json-view';
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { beginCell } from '@ton/ton'; // Добавлен импорт для beginCell

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
    const [userTonAddress, setUserTonAddress] = useState<string>('');
    const [nftId, setNftId] = useState<string>(uuidv4()); // Генерируем UUID при инициализации компонента

    useEffect(() => {
  setUserTonAddress('UQDRd8OMx2SdI6KgjG_KnLnuk9BYkdsfyOlO9jKxmdQAE00c');
}, []);
    
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

    useEffect(() => {
      if (boxData && boxData.total >= 1) {
        fetchBoxTotal(userData!.id); // Обновляем данные, если total больше или равно 1
      }
    }, [boxData]);

    // Функция для получения данных о total по id пользователя
    const fetchBoxTotal = async (userId: number) => {
  try {
    const response = await fetch(`https://advisory-brandi-webapp.koyeb.app/box/${userId}`);
    if (response.ok) {
      const data = await response.json();
      const total = parseInt(data.total); // Преобразуем строку в число
      setBoxData({ total });
    } else {
      console.error('Failed to fetch box total');
    }
  } catch (error) {
    console.error('Error fetching box total:', error);
  }
};

    
    const handleAddOrderNFT = async () => {
      if (!userData || !userTonAddress || !nftId) {
        console.error('Missing required data');
        return;
      }

      try {
        const response = await fetch('https://advisory-brandi-webapp.koyeb.app/orders_nft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegram_user_id: userData.id,
            user_ton_address: userTonAddress,
            nft_id: nftId,
            date: new Date().toISOString().split('T')[0], // Отправляем текущую дату
          }),
        });

        if (response.ok) {
          console.log('New order added successfully');
          fetchBoxTotal(userData.id); // Обновляем данные после успешного добавления нового заказа
        } else {
          console.error('Failed to add new order');
        }
      } catch (error) {
        console.error('Error adding new order:', error);
      }
    };

    const defaultTx: SendTransactionRequest = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
      {
        address: 'UQDRd8OMx2SdI6KgjG_KnLnuk9BYkdsfyOlO9jKxmdQAE00c',
        amount: '5000000',
        //stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
        // Удалено значение payload, чтобы оно бралось из body
      },
    ],
  };

  const [tx, setTx] = useState(defaultTx);
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const onChange = useCallback((value: InteractionProps) => {
    setTx(value.updated_src as SendTransactionRequest)
  }, []);

  const createTransaction = () => {
    const body = beginCell()
      .storeUint(0, 32)
      .storeStringTail(nftId.toString())
      .endCell();

    const payload = body.toBoc().toString("base64");

    const updatedTx: SendTransactionRequest = {
      ...tx,
      messages: [
        {
          ...tx.messages[0], // Копируем остальные свойства сообщения
          payload: payload,
        },
      ],
    };

    tonConnectUi.sendTransaction(updatedTx)
    .then(() => {
      console.log('Transaction sent successfully');
      handleAddOrderNFT(); // Вызываем handleAddOrderNFT после успешной отправки транзакции
    })
    .catch((error) => {
      console.error('Error sending transaction:', error);
    });
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
                            {boxData && boxData.total >= 1 ? ( // Показываем кнопки только если total больше или равно 1
          <React.Fragment>
            {wallet ? (
              <button className="open-box" onClick={createTransaction}>
                Pay 0.05 TON and open
              </button>
            ) : (
              <button className="open-box" onClick={() => tonConnectUi.openModal()}>
                Connect wallet
              </button>
            )}
          </React.Fragment>
        ) : null}
                        </div>
                    </div>
                </div>
            </PageComponent>
        </div>
    );
};

export default Box;


