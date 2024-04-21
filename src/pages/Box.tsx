import React from 'react';
import './box.scss';
import PageComponent from '../components/PageComponent/PageComponent';

const Box: React.FC = () => {
    return (
    <div className="content">
        <PageComponent>
            <div className="box-container">
                <div className="box-body">
                    <div className="watch-box">
                        <img src="https://i.ibb.co/jLcwk8W/IMG-1679.jpg" className="box-image" />
                    </div>
                    <div className="box-reward">
                    </div>
                    <div>
                        <button type="button" className="open-box">Open</button>
                    </div>
                </div>
            </div>
        </PageComponent>
    </div>
    );
};

export default Box;
