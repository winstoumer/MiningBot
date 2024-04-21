import {TonConnectButton} from "@tonconnect/ui-react";
import './header.scss';

export const Header = () => {
    return <header>
        <TonConnectButton className="ton-button" style={{background: #000000;}} />
    </header>
}
