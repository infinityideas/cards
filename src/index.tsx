import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Play from './Play';
import CrazyEights from './games/crazyeights';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/play" element={<Play />} />
        <Route path="/games/crazyeights" element={<CrazyEights />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
