import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const ErrorBoundary: React.FC = () => {
  const [error, setError] = useState(false);

  if (error) {
    return <Redirect to="/home" />;
  }

  // Ваш основной компонент
};

export default ErrorBoundary;
