import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

interface ErrorBoundaryProps extends RouteComponentProps<any> {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC = ({ children }: ErrorBoundaryProps) => {
  const history = useHistory();

  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const unlisten = history.listen(() => {
      // Сброс ошибки при изменении маршрута
      setHasError(false);
    });
    return () => unlisten();
  }, [history]);

  const handleError = () => {
    setHasError(true);
    // Перенаправляем пользователя на /home при возникновении ошибки
    history.push('/home');
  };

  if (hasError) {
    // Можно добавить пользовательский компонент для отображения ошибки, если необходимо
    return <div>Oops! Something went wrong.</div>;
  }

  return children;
};

export default ErrorBoundary;
