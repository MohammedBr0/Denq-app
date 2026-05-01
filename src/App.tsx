// @ts-nocheck
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import AuthView from './auth-pages/AuthView';
import AccountView from './auth-pages/AccountView';

export default function App() {
  return (
    <main>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/auth/sign-in">Auth</Link>
        <Link to="/account">Account</Link>
      </nav>
      <Routes>
        <Route path="/auth/*" element={<AuthView />} />
        <Route path="/account" element={<AccountView />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </main>
  );
}
