import React from 'react'
import './market.scss';
import PageComponent from '../components/PageComponent/PageComponent';
import TxForm from "./components/TxForm/TxForm";

const Market: React.FC = () => {
  return <PageComponent>
      <TxForm />
      <div className="content">
          <button type="button" className="button">Collecting</button>
      </div>
  </PageComponent>;
};

export default Market;