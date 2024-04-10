import './navigation.scss';
import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

export const Navigation = () => {
    return <div className="bottom-navigation">
        <div className="navigation-block">
           <Link to="/">Mining</Link>
        </div>
        <div className="navigation-block">
            <Link to="/boost">Boost</Link>
        </div>
        <div className="navigation-block">
            <Link to="/inventory">Market</Link>
        </div>
        <div className="navigation-block">
            <Link to="/task">Earn</Link>
        </div>
        <div className="navigation-block">
            <Link to="/box">Box</Link>
        </div>
    </div>
}
