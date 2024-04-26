import './patch-local-storage-for-github-pages';

import React, {StrictMode} from 'react'
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'
import './index.scss'
import eruda from "eruda";
import ErrorBoundary from '..component/ErrorBoundary/ErrorBoundary';

eruda.init();

render(
    <Router>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
  </Router>,
    document.getElementById('root') as HTMLElement
)
