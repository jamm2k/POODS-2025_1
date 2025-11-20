import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

export default function DebugApp() {
  console.log('DebugApp montado');
  return (
    <div style={{ padding: 20 }}>
      <h1>DebugApp</h1>
      <p>Se isto aparecer, o problema está nas rotas / PrivateRoute / PublicRoute / AuthContext.</p>
    </div>
  );
}