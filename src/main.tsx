import './patch-local-storage-for-github-pages';

import React, {StrictMode} from 'react'
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'
import './index.scss'
//import eruda from "eruda";

//eruda.init();

render(
        <StrictMode>
            <App />
        </StrictMode>
  ,
    document.getElementById('root') as HTMLElement
)
