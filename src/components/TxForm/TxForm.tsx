import React, { useCallback, useState } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import './style.scss';
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { beginCell } from '@ton/ton'; // Импортируем beginCell из TON SDK

// Функция для кодирования сообщения в формате Base64
const encodeMessage = (message: string) => {
  const body = beginCell()
    .storeUint(0, 32)
    .storeStringTail(message)
    .endCell();
  return body.toBoc().toString("base64");
}

export function TxForm() {

  const [tx, setTx] = useState<SendTransactionRequest>({
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [],
  });

  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const onChange = useCallback((value: InteractionProps) => {
    setTx(value.updated_src as SendTransactionRequest)
  }, []);

  // Функция для добавления сообщения с закодированным payload
  const addMessage = (message: string) => {
    const encodedPayload = encodeMessage(message);
    const newMessage = {
      address: 'UQCKNa82Guhh8XZGzr4eEBI887KVLz9UtTjD3cidgv3wS0Mv',
      amount: '5000000',
      payload: encodedPayload,
    };
    setTx(prevTx => ({
      ...prevTx,
      messages: [...prevTx.messages, newMessage],
    }));
  }

  return (
    <div className="send-tx-form">
      <h3>Configure and send transaction</h3>

      <ReactJson theme="ocean" src={tx} onEdit={onChange} onAdd={onChange} onDelete={onChange}/>

      <input type="text" placeholder="Enter your message" onChange={(e) => addMessage(e.target.value)} />

      {wallet ? (
        <button onClick={() => tonConnectUi.sendTransaction(tx)}>
          Send transaction
        </button>
      ) : (
        <button onClick={() => tonConnectUi.openModal()}>
          Connect wallet to send the transaction
        </button>
      )}
    </div>
  );
}



