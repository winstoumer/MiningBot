// components/PageComponent/PageComponent.tsx
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const PageComponent: React.FC = ({ children }) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const backButton = window.Telegram.WebApp.BackButton;

    if (location.pathname !== '/') {
      backButton.show();
    } else {
      backButton.hide();
    }

    backButton.onClick(() => {
      history.goBack();
    });

    return () => {
      backButton.hide();
    };
  }, [history, location]);

  return <div>{children}</div>;
};

export default PageComponent;
