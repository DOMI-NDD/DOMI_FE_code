import AppRouter from '@/router/AppRouter';
import useReissue from './pages/login/Reissue';

export default function App() { 
  useReissue()
  return <AppRouter />; 
}