import React from 'react'
import './market.scss';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { beginCell } from '@ton/ton'

const body = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment..
  .endCell();

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: 'UQCKNa82Guhh8XZGzr4eEBI887KVLz9UtTjD3cidgv3wS0Mv',
            amount: toNano("0.05"),
            payload: body.toBoc().toString("base64") // payload with comment in body
        }
    ]
}

const Market: React.FC = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
        </div>
    );
};

export default Market;