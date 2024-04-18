import React from 'react'
import './market.scss';
import { useTonConnectUI } from '@tonconnect/ui-react';

import {beginCell, toNano, Address} from '@ton/ton'
    // transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
    // response_destination:MsgAddress custom_payload:(Maybe ^Cell)
    // forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
    // = InternalMsgBody;

    const destinationAddress = Address.parse('UQCKNa82Guhh8XZGzr4eEBI887KVLz9UtTjD3cidgv3wS0Mv');

    const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail('Hello, TON!')
        .endCell();

const body = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment..
  .endCell();

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: destinationAddress,
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