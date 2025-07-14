import { useEffect, useState } from 'react'
import client from 'socket.io-client';

const socket = client.io('http://localhost:3000/')


function App() {
  const [count, setCount] = useState(0)
  const [allUsers, setAllUsers] = useState({});
  const enemiesCounts = Object.values(allUsers);


  useEffect(() => {
    socket.on('updat-count',  (serverAllUsers) => {
     console.log('update-count', socket.id, serverAllUsers);
     const currentUserCount = serverAllUsers[socket.id];
     setCount(currentUserCount);
     delete serverAllUsers[socket.id];
     setAllUsers(serverAllUsers);
    });

    socket.on('winner', (winnerid) => {
      if (winnerid === socket.Id){
        alert ('game over, you win')
        return;
      }
      alert('Game over')
    })

    return () => {
      socket.off('updat-count');
    };
  }, []);

  const handleButtonClick = () => {
    socket.emit('increase-count');
  }


  return (
    <>
    <div
            style={{
              width: '100px',
              height: '100px',
              position: 'relative',
              left:`${count * 10}px`,
              marginBotton: '10px',
              backgroundColor: 'pink'
            }}
          />
        {enemiesCounts.map((count,index) => (
          <div
            style={{
              width: '100px',
              height: '100px',
              position: 'relative',
              left:`${count * 10}px`,
              marginBotton: '10px',
              backgroundColor: 'pink'
            }}
            key={index}
          />
        ))}
      <div className="card">
        <button onClick={handleButtonClick}>
         Click to increase count
        </button>
      </div>
    </>
  )
}

export default App

