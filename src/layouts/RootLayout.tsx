import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <>
      {/* 공용 Header 자리 */}
      <Outlet />
      {/* 공용 Footer 자리 */}
    </>
  );
}