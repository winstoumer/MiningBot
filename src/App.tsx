import './App.scss';
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Navigation } from "./components/Navigation/Navigation";
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Boost from './pages/Boost';
//import Market from './pages/Market';
import Task from './pages/Task';
import Box from './pages/Box';
import TelegramScript from "./components/TelegramScript/TelegramScript";
import TelegramUser from "./components/TelegramUser/TelegramUser";
import './telegram.d.ts';

import {TonProofDemo} from "./components/TonProofDemo/TonProofDemo";

function App() {

  return (
    <TonConnectUIProvider
      manifestUrl="https://advisory-brandi-webapp.koyeb.app/api/json-x/tonconnect-manifest.json"
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
          <TelegramUser />
          <TelegramScript />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boost" element={<Boost />} />
            <Route path="/task" element={<Task />} />
            <Route path="/box" element={<Box />} />
          </Routes>
          <Navigation />
        </Router>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;


