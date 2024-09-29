import React from 'react';
import { FaStrava } from "react-icons/fa";

const StravaAuthButton = () => {
  const handleAuth = () => {
    window.location.href = 'http://localhost:3003/auth/strava';  // Redirect to backend to start OAuth
  };

  return <button className='bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-md flex gap-2 justify-center items-center' onClick={handleAuth}><FaStrava /> Connect Strava</button>;
};

export default StravaAuthButton;
