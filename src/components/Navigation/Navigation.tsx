import './navigation.scss';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageComponent from '../components/PageComponent/PageComponent';

export const Navigation = () => {
    
    return <PageComponent><div className="bottom-navigation">
        <div className="navigation-block">
           <Link to="/">Mining</Link>
        </div>
        <div className="navigation-block">
            <Link to="/boost">Boost</Link>
        </div>
        <div className="navigation-block">
            <Link to="/task">Earn</Link>
        </div>
        <div className="navigation-block">
            <Link to="/market">Box</Link>
        </div>
    </div>
    </PageComponent>
};