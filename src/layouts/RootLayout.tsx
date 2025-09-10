import { Outlet } from 'react-router-dom';
import Header from "@/layouts/Header";

export default function RootLayout() {
  return (
    <>
      {/* 공용 Header 자리 */}
      <Header/>
      <Outlet />
      {/* 공용 Footer 자리 */}
    </>
  );
}

