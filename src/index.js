import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 如果您想要开始测量应用程序的性能，請傳遞一個函數
// 來記錄結果（例如：reportWebVitals(console.log)）
// 或發送到分析端點。了解更多：https://bit.ly/CRA-vitals
reportWebVitals(); 