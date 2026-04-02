import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AppLayout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '32px 24px' }}>
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
