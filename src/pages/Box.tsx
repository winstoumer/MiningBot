import React from 'react';
import './box.scss';
import PageComponent from '../components/PageComponent/PageComponent';

const Box: React.FC = () => {
    return (
        <PageComponent>
            <div className="content">
                <span className="dot-test">•••</span>
            </div>
        </PageComponent>
    );
};

export default Box;
