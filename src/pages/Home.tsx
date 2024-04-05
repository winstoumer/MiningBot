import React from 'react'
import './home.scss';

const Home: React.FC = () => {
  return <div>
    <div className="content">
        <div className="balance">
            <div className="title-block">Total balance (CLO)</div>
            <div className="total-balance">
                <span>CLO</span>
                2000
            </div>
        </div>
        <div className="general-token">
            <div className="set-mining">
                <div className="token-title">
                    Mining
                </div>
                <div className="">
                   <div className="token">
                       <span id="counter">0.000001</span>
                   </div>
                   <div className="info-mine-count">
                       (0.1 coin per hour)
                   </div>
                </div>
            </div>
            <div className="set-mining">
                <div className="token-title">
                    Level
                </div>
                <div className="token">
                    <span className="prm-set">6</span>
                </div>
            </div>
        </div>
        <div className="content-machine">
            <div className="watch-machine">
                <img src="https://i.ibb.co/4p2tJP6/Designer-8.jpg" className="img-comp" />
            </div>
        </div>
    </div>
  </div>;
};

export default Home;