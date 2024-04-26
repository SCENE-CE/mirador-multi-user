import React from 'react';

interface LandingProps {
  navigateTo: (url: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ navigateTo }) => {
  let user:string;

  const handleStart = () => {
    if (user) {
      navigateTo('/app');
    } else {
      navigateTo('/login');
    }
  };

  return(
    <div>
      <h1>Landing Page</h1>
      <button onClick={handleStart}>Go somewhere else</button>
    </div>
  )
}
