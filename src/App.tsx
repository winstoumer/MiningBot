import './App.scss';
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Navigation } from "./components/Navigation/Navigation";
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Boost from './pages/Boost';
import Market from './pages/Market';
import Task from './pages/Task';
import TelegramScript from "./components/TelegramScript/TelegramScript";
import TelegramUser from "./components/TelegramUser/TelegramUser";
import './telegram.d.ts';

function App() {
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.setHeaderColor('#ffffff');
          window.Telegram.WebApp.expand();
        }
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  useEffect(() => {
    const backButton = window.Telegram.WebApp.BackButton;

    if (window.location.pathname !== '/') {
      backButton.show();
    } else {
      backButton.hide();
    }

    backButton.onClick(() => {
      window.history.back(); // Используем нативную JavaScript функцию для перехода назад
    });

    // Очистка обработчика при размонтировании компонента
    return () => {
      backButton.hide();
    };
  }, []);

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
          <TelegramUser />
          <TelegramScript />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boost" element={<Boost />} />
            <Route path="/market" element={<Market />} />
            <Route path="/task" element={<Task />} />
          </Routes>
          <Navigation />
        </Router>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;


