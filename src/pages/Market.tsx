import React from 'react';
import './market.scss';
import {TxForm} from "./components/TxForm/TxForm";

const Market: React.FC = () => {

  return (
    <div className="content">
        <TxForm />
    </div>
  );
};

export default Market;
