import './App.scss'
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "./components/Header/Header";
import {TxForm} from "./components/TxForm/TxForm";
import {Footer} from "./components/Footer/Footer";
import {Navigation} from "./components/Navigation/Navigation";
import {TonProofDemo} from "./components/TonProofDemo/TonProofDemo";
import React, { useEffect } from 'react';
   import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
   import Home from './pages/Home';
   import Market from './pages/Market';

function App() {
    useEffect(() => {
    // Проверяем, доступен ли объект Telegram WebApp API
    if (window.Telegram?.WebApp) {
      // Развернуть WebApp на весь экран
      window.Telegram.WebApp.expand();
    }
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз после первого рендеринг
  return (
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
              twaReturnUrl: 'https://t.me/minerweb3_bot/app'
          }}
      >
        <div className="app">
            <Router>
        <Header />
                <Navigation />
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/market" element={<Market />} />
         </Routes>
       </Router>
        </div>
      </TonConnectUIProvider>
  )
}

export default App
