
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced global error handling
window.addEventListener('error', (event) => {
  console.error('Global JavaScript error:', {
    message: event.error?.message || 'Unknown error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    timestamp: new Date().toISOString()
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise rejection:', {
    reason: event.reason,
    timestamp: new Date().toISOString()
  });
});

// Debug information
console.log('=== APPLICATION STARTUP DEBUG ===');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Supabase URL available:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key available:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Document ready state:', document.readyState);
console.log('User Agent:', navigator.userAgent);

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('CRITICAL: Root element not found!');
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1a5d4a; color: white; font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; max-width: 500px;">
        <h1 style="color: #fbbf24; margin-bottom: 16px;">🚨 Lỗi Khởi Động Nghiêm Trọng</h1>
        <p style="margin-bottom: 20px;">Không tìm thấy phần tử root trong HTML. Đây là lỗi cấu hình cơ bản.</p>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 14px; color: #a7f3d0;">Chi tiết kỹ thuật:</p>
          <p style="font-size: 12px; color: #d1fae5;">Element 'root' không tồn tại trong DOM</p>
        </div>
        <button onclick="location.reload()" style="background: #fbbf24; color: #1a5d4a; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">
          🔄 Tải Lại Trang
        </button>
        <br><br>
        <a href="/system-audit" style="color: #a7f3d0; text-decoration: underline; font-size: 14px;">
          🔍 Chạy Kiểm Tra Hệ Thống
        </a>
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
  
  console.log('✅ App rendered successfully!');
  
  // Additional startup checks
  setTimeout(() => {
    console.log('=== POST-STARTUP HEALTH CHECK ===');
    console.log('React root exists:', !!root);
    console.log('App component mounted:', document.querySelector('[data-reactroot]') !== null);
    console.log('DOM elements count:', document.querySelectorAll('*').length);
    console.log('Current URL:', window.location.href);
    console.log('localStorage available:', typeof Storage !== 'undefined');
    console.log('=== HEALTH CHECK COMPLETE ===');
  }, 1000);
  
} catch (error) {
  console.error('CRITICAL: Failed to render app:', error);
  
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1a5d4a; color: white; font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; max-width: 600px;">
        <h1 style="color: #fbbf24; margin-bottom: 16px;">⚠️ Lỗi Khởi Động Ứng Dụng</h1>
        <p style="margin-bottom: 20px;">Đã xảy ra lỗi khi khởi động ứng dụng React. Đây có thể là lỗi JavaScript hoặc cấu hình.</p>
        
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <p style="font-size: 14px; color: #a7f3d0; margin-bottom: 8px;">Chi tiết lỗi:</p>
          <pre style="font-size: 12px; color: #d1fae5; white-space: pre-wrap; word-break: break-word;">${error.message}</pre>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
          <button onclick="location.reload()" style="background: #fbbf24; color: #1a5d4a; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🔄 Tải Lại Trang
          </button>
          <button onclick="window.location.href='/system-audit'" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🔍 Kiểm Tra Hệ Thống
          </button>
          <button onclick="window.location.href='/'" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🏠 Về Trang Chủ
          </button>
        </div>
        
        <details style="margin-top: 20px; text-align: left;">
          <summary style="cursor: pointer; color: #a7f3d0;">🔧 Hướng Dẫn Khắc Phục</summary>
          <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 6px;">
            <p style="font-size: 14px; margin-bottom: 8px;">Các bước khắc phục:</p>
            <ol style="font-size: 13px; color: #d1fae5; padding-left: 20px;">
              <li>Tải lại trang (F5 hoặc Ctrl+R)</li>
              <li>Xóa cache trình duyệt (Ctrl+Shift+Del)</li>
              <li>Kiểm tra kết nối mạng</li>
              <li>Thử trình duyệt khác</li>
              <li>Liên hệ hỗ trợ kỹ thuật</li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  `;
}
