import React, { useCallback, useState } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import './market.scss';
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { beginCell } from '@ton/ton'; // Добавлен импорт для beginCell

const Market: React.FC = () => {

  const defaultTx: SendTransactionRequest = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
      {
        address: 'UQCKNa82Guhh8XZGzr4eEBI887KVLz9UtTjD3cidgv3wS0Mv',
        amount: '5000000',
        // stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
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
      .storeStringTail("Hello, TON!")
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

    tonConnectUi.sendTransaction(updatedTx);
  };

  return (
    <div className="content">
      <div className="send-tx-form">
        <h3>Configure and send transaction</h3>

        <ReactJson theme="ocean" src={defaultTx} onEdit={onChange} onAdd={onChange} onDelete={onChange}/>

        {wallet ? (
          <button onClick={createTransaction}>
            Send transaction
          </button>
        ) : (
          <button onClick={() => tonConnectUi.openModal()}>
            Connect wallet to send the transaction
          </button>
        )}
      </div>
    </div>
  );
};

export default Market;

