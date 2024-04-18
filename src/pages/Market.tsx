import React from 'react'
import './market.scss';
import PageComponent from '../components/PageComponent/PageComponent';

const Market: React.FC = () => {
  return <PageComponent>
      <div className="content">
          <button type="button" className="button">Collecting</button>
      </div>
  </PageComponent>;
};

export default Market;