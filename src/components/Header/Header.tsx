import {TonConnectButton} from "@tonconnect/ui-react";
import './header.scss';

export const Header = () => {
    return <header>
        <TonConnectButton className="connect-wallet-button" />
    </header>
}
