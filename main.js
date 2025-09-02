
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dock from '../components/desktop/Dock';
import PortfolioWindow from '../components/desktop/PortfolioWindow';
import MessageWindow from '../components/desktop/MessageWindow';
import TerminalWindow from '../components/desktop/TerminalWindow';

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState({
    portfolio: false,
    messages: false,
    terminal: false
  });

  const [windowPositions, setWindowPositions] = useState({
    portfolio: { x: 100, y: 50 },
    messages: { x: 200, y: 100 },
    terminal: { x: 150, y: 75 }
  });

  const openWindow = (windowType) => {
    setOpenWindows(prev => ({
      ...prev,
      [windowType]: true
    }));
  };

  const closeWindow = (windowType) => {
    setOpenWindows(prev => ({
      ...prev,
      [windowType]: false
    }));
  };

  const bringToFront = (windowType) => {

    setOpenWindows(prev => ({ ...prev }));
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* stop looking at my code */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* jew */}
      <AnimatePresence>
        {openWindows.portfolio && (
          <PortfolioWindow
            position={windowPositions.portfolio}
            onClose={() => closeWindow('portfolio')}
            onFocus={() => bringToFront('portfolio')}
          />
        )}
        
        {openWindows.messages && (
          <MessageWindow
            position={windowPositions.messages}
            onClose={() => closeWindow('messages')}
            onFocus={() => bringToFront('messages')}
          />
        )}
        
        {openWindows.terminal && (
          <TerminalWindow
            position={windowPositions.terminal}
            onClose={() => closeWindow('terminal')}
            onFocus={() => bringToFront('terminal')}
          />
        )}
      </AnimatePresence>

      {/* im tuff right */}
      <Dock onOpenWindow={openWindow} openWindows={openWindows} />
      
      {/* DADDYYY */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-full px-4 text-white text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Scarlett</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
