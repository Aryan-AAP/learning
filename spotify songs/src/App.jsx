import React from 'react';
// import SpotifyPlayer from './SpotifyPlayer';
//import css
import './index.css';
import SpotifyPlayer from './lol';
const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text 
                         bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600
                         animate-gradient-x">
            Spotify Player Demo
          </h1>
          <p className="text-xl text-gray-300 font-light">
            A simple Vite + React application with embedded Spotify player
          </p>
          <div className="h-[2px] w-24 mx-auto bg-gradient-to-r 
                          from-transparent via-purple-500 to-transparent" />
        </div>
      </div>
      <SpotifyPlayer />
    </div>
  );
};

export default App;