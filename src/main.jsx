import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css'
import ReactDOM from 'react-dom/client'
import OngoingSwapPage from './pages/OngoingSwapPage.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PuzzleWalletProvider } from '@puzzlehq/sdk';
  

const Main = () => {
  // Check if the user is logged in by checking if the token exists in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
  };

  return (
    <PuzzleWalletProvider
        dAppName="Bonds"
        dAppDescription="Bonds NFT Platfom"
        dAppUrl="https://usebonds.netlify.app/ongoingswap"
        dAppIconURL="https://github.com/BringerAppLTD/Bonds-web-app/blob/main/front-end/src/assets/Bonds_new.png"
        // projectId="<YOUR WALLETCONNECT PROJECT ID>" // optional
    >
      <Router>
          <Routes>
              
              
              <Route
                  path="/ongoingswap"
                  element={<OngoingSwapPage />}
              />
              
              {/* Default Route */}
                <Route path="/" element={<Navigate to={"/ongoingswap"} />} />
          </Routes>
      </Router>
    </PuzzleWalletProvider>  
  );
};



ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <Main />
</React.StrictMode>
);
