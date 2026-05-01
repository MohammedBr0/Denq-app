// @ts-nocheck
import { Link, Route, Routes } from 'react-router-dom';

function SignInView() {
  return <div><h2>Sign in</h2><p>Use Neon Auth UI components here.</p><Link to="/auth/sign-up">Need an account?</Link></div>;
}

function SignUpView() {
  return <div><h2>Sign up</h2><p>Create a new account with email OTP.</p><Link to="/auth/sign-in">Already have an account?</Link></div>;
}

export default function AuthView() {
  return (
    <Routes>
      <Route path="sign-in" element={<SignInView />} />
      <Route path="sign-up" element={<SignUpView />} />
    </Routes>
  );
}
