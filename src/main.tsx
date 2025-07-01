
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Application starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1a5d4a; color: white; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1>Lỗi khởi động ứng dụng</h1>
        <p>Không tìm thấy phần tử root. Vui lòng liên hệ hỗ trợ.</p>
      </div>
    </div>
  `;
  throw new Error('Root element not found');
}

try {
  console.log('Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('Rendering App component...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('App rendered successfully!');
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1a5d4a; color: white; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1>Lỗi khởi động ứng dụng</h1>
        <p>Đã xảy ra lỗi khi khởi động. Vui lòng tải lại trang.</p>
        <button onclick="location.reload()" style="background: #fbbf24; color: #1a5d4a; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 16px;">
          Tải lại trang
        </button>
      </div>
    </div>
  `;
}
