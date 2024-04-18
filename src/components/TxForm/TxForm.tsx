import React from 'react';

import { useTonConnectUI } from '@tonconnect/ui-react';
import { beginCell, toNano, Address } from '@ton/ton';

const destinationAddress = 'UQCKNa82Guhh8XZGzr4eEBI887KVLz9UtTjD3cidgv3wS0Mv';

const body = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const myTransaction = {
  validUntil: Math.floor(Date.now() / 1000) + 360,
  messages: [
    {
      address: destinationAddress,
      amount: toNano("0.05").toString(),
      payload: body.toBoc().toString("base64")
    }
  ]
};

export function TxForm() {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  return (
    <div>
      <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
        Send transaction
      </button>
    </div>
  );
}

