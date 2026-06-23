import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  // Capture global window.onerror to suppress any sandboxed/cross-origin "Script error."
  const originalOnError = window.onerror;
  window.onerror = function (message, url, line, col, error) {
    const msgStr = String(message || "");
    if (msgStr.toLowerCase().includes("script error") || !url || url.includes("extensions") || url.includes("chrome-extension")) {
      console.warn("[Aether Sandboxing] Intercepted and silenced cross-origin script exception:", message, "from url:", url);
      return true; // Stop propagation and display
    }
    if (originalOnError) {
      return (originalOnError as any).apply(this, arguments);
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (event.message && event.message.toLowerCase().includes('script error')) {
      console.warn('Aether sandboxing: handled external script noise.', event);
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Aether sandbox unhandled promise absorbed:', event.reason);
    event.preventDefault();
    event.stopPropagation();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
