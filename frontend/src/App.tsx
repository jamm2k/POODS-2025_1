import { useState, PropsWithChildren } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/Auth/LoginPage';
//import DashboardPage from './pages/DashboardPage';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [count, setCount] = useState(0)

  return (
     <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
