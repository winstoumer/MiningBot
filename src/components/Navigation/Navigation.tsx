import './navigation.scss';
import { Link } from 'react-router-dom';
import PageComponent from '../PageComponent/PageComponent';

export const Navigation = () => {
    
    return <PageComponent>
        <div className="bottom-navigation">
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
                <Link to="/box">Nft</Link>
            </div>
        </div>
    </PageComponent>
};