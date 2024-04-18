import React from 'react'
import './market.scss';
import PageComponent from '../components/PageComponent/PageComponent';
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {TxForm} from "./components/TxForm/TxForm";
import {TonProofDemo} from "./components/TonProofDemo/TonProofDemo";

const Market: React.FC = () => {
  return <PageComponent>
      <TonConnectUIProvider
          manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
          uiPreferences={{ theme: THEME.DARK }}
          walletsListConfiguration={{
            includeWallets: [
              {
                appName: "safepalwallet",
                name: "SafePal",
                imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
                aboutUrl: "https://www.safepal.com/download",
                jsBridgeKey: "safepalwallet",
                platforms: ["ios", "android", "chrome", "firefox"]
              },
              {
                appName: "tonwallet",
                name: "TON Wallet",
                imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
                aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
                universalLink: "https://wallet.ton.org/ton-connect",
                jsBridgeKey: "tonwallet",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["chrome", "android"]
              }
            ]
          }}
          actionsConfiguration={{
              twaReturnUrl: 'https://t.me/DemoDappWithTonConnectBot/demo'
          }}
      >
        <div className="">
            <TxForm />
            <TonProofDemo />
        </div>
      </TonConnectUIProvider>

  </PageComponent>;
};

export default Market;