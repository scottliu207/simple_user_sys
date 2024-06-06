import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginForm from './components/Login';
import SignupForm from './components/SignUp';
import GoogleLoginButton from './components/GoogleSignInBtn';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
      <div className="container mt-5">
        <h2>User Authentication</h2>
        <LoginForm />
        <GoogleLoginButton />
        <hr />
        <SignupForm />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
