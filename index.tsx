import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🚨 هذا هو الكود المضاف لتسجيل Service Worker وبدء العمل دون اتصال
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // نستخدم المسار النسبي: ./service-worker.js
    // يجب أن يكون هذا الملف موجوداً في نفس مستوى index.html
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registered successfully: ', registration);
      })
      .catch(registrationError => {
        console.error('Service Worker registration failed: ', registrationError);
      });
  });
}
