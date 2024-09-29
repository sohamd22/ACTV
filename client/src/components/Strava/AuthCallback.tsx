import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract the token from the query parameters
    const token = searchParams.get('token');
    const username = searchParams.get('username');

    if (token) {
      // Save the token in localStorage
      localStorage.setItem('token', token);

      if (username) {
        localStorage.setItem('username', username);
      }

      // Redirect to home or another page
      navigate('/');
    } else {
      // If no token, redirect to an error page or show an error message
      console.error('No token found');
    }
  }, [navigate, searchParams]);

  return <div>Logging you in...</div>;
};

export default AuthCallback;
