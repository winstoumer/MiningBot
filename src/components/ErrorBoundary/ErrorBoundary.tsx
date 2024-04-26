// ErrorBoundary.tsx
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface ErrorBoundaryProps extends RouteComponentProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component
{
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ hasError: true });
    // Перенаправляем пользователя на /home при возникновении ошибки
    this.props.history.push('/home');
  }

  render() {
    if (this.state.hasError) {
      // Можно добавить пользовательский компонент для отображения ошибки, если необходимо
      return <div></div>;
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
