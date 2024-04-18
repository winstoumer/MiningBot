import React, { useCallback, useState } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import './style.scss';
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export function TxForm() {
  // Генерация закодированного payload
  const text = 'текст';
  const encodedPayload = btoa(text);

  const defaultTx: SendTransactionRequest = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
      {
        address: 'UQCKNa82Guhh8XZGzr4eEBI887KVLz9UtTjD3cidgv3wS0Mv',
        amount: '5000000',
        stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
        // Добавление закодированного payload
        payload: encodedPayload,
      },
    ],
  };

  const [tx, setTx] = useState(defaultTx);
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const onChange = useCallback((value: InteractionProps) => {
    setTx(value.updated_src as SendTransactionRequest)
  }, []);

  return (
    <div className="send-tx-form">
      <h3>Configure and send transaction</h3>
      <ReactJson theme="ocean" src={defaultTx} onEdit={onChange} onAdd={onChange} onDelete={onChange}/>
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
