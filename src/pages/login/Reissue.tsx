import axios from 'axios';
import { useEffect } from 'react';
import URL from '@/layouts/Url';

export default function useReissue() {
  useEffect(() => {
    const interval = setInterval(async () => {
      
      const accountId = localStorage.getItem('accountId');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) return;

      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();

      if (expiresIn < 60 * 1000) {
        try {
          const response = await axios.post(`${URL}/auths/reissue`, {
            accountId: accountId,
            refreshToken: refreshToken,
          });
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);

          console.log('토큰 재발급 완료');
          console.log(response.data.refreshToken)
        } catch (err) {
          console.error('토큰 재발급 실패', err);
        }
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);
}