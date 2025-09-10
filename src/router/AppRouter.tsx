import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from '@/pages/home/HomePage';
import RootLayout from '@/layouts/RootLayout';
import Login from '@/pages/login/login';
import DashBorad from '@/pages/dash-board/DashBoard';

export default function AppRouter() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  // localStorage 변경 시 상태 업데이트
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("accessToken"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  
  return (
    <Routes>
      {
        !token
        ? <Route path='/*' element={<Login setToken={setToken} />}/>
        : <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path='/dashboard' element={<DashBorad />} />
          </Route>
      }
      
    </Routes>
  );
}
