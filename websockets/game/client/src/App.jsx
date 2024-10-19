import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './App.css'
import Input from './components/Input';

function App() {
  const socket=io('http://localhost:3000');
  function connectSocket(){
    socket.on('connection', (socket) => {
      console.log(socket);
  });
}
function handleInput(event){
  

}
  useEffect(() => {

  }, []);

  return (
 <>
 <h1>React Multiplayer Dashboard</h1>
 <Input className="input-field" placeholder="Enter your name" />
 <Input className="input-field" placeholder="Enter your Score" />
 
 </>
  )
}

export default App
