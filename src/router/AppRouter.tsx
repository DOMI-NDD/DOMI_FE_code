import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from '@/pages/home/HomePage';
import RootLayout from '@/layouts/RootLayout';
import Login from '@/pages/login/login';
import DashBoard from '@/pages/dash-board/DashBoard';
import useReissue from '@/pages/login/Reissue';

export default function AppRouter() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  
  // BrowserRouter 내부에서 useReissue 호출
  useReissue();

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("accessToken"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />

      {token ? (
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
      ) : (
        <Route path="/*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}