import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home/HomePage';
import RootLayout from '@/layouts/RootLayout';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
