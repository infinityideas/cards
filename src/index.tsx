import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Play from './Play';
import CrazyEights from './games/crazyeights';
import CrazyEightsGuest from './games/crazyeights_guest';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/play" element={<Play />} />
        <Route path="/games/crazyeights" element={<CrazyEights />} />
        <Route path="/play/crazyeights/:id" element={<CrazyEightsGuest />} />
      </Routes>
    </BrowserRouter>
);
