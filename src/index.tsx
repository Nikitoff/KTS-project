import * as React from 'react';
import * as ReactDom from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import Recipes from './Pages/MainPage/MainPage';
import App from 'App/App';


const container = document.getElementById('root');

if (!container) {
  throw new Error('Корневой элемент #root не найден в DOM');
}
ReactDom
  .createRoot(container)
  .render(
    <React.StrictMode>

      <BrowserRouter>
        <App />

      </BrowserRouter>
    </React.StrictMode>
  );