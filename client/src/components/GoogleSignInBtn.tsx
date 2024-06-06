import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
    const handleGoogleLogin = (res: any) => {
        console.log('Google sign-in response:', res);
        alert('Google sign-in successful');
    };

    return (
        <div>
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert('Google sign-in failed')} />
        </div>
    );
};

export default GoogleLoginButton;
